/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, jQuery, _, amplify, angular, CONST, helpers, app */
'use strict';

var LinesManager = function(data_provider) {
    /* Store info about host addr(fqdn or ip_addr) and its line.
    *  Have embedded cache and unresolved addr aaray to minimize remote calls.
    */
    this.data_provider = data_provider;
    this.cache = {};
    this.set = [];
    this.unresolved_fqdns = [];
    this.unresolved_ip_addrs = [];
};

LinesManager.prototype = {
    add_addr:
    function(self, host_addr){
        /*
        *  data_provider - provide data_factory1 interface to fetch hosts details.
        *  host_addrr - str, fqdn or ip_addr.
        */
        if (typeof(host_addr) == 'object') {
            host_addr = JSON.stringify(host_addr);
            self.set.push(host_addr);
            self.cache[host_addr] = {
                'line': 'unknown',
                'name_ext': 'short notation ' + host_addr
            };
            return;
        }

        if (_.has(self.cache, host_addr)) {
            self.set.push(host_addr);
            return;
        }

        if (this.unresolved_fqdns.indexOf(host_addr) === -1 ) {
            self.set.push(host_addr);
            self.data_provider.get_host(host_addr) // try to use as fqdn
                .then(function(resp) {
                    self.cache[host_addr] = {
                        'line': resp.data.line.name,
                        'name_ext': host_addr
                    };
                }, function(resp) {
                    self.unresolved_fqdns.push(host_addr);
                });
        }


        if (this.unresolved_ip_addrs.indexOf(host_addr) === -1 ) {
            self.set.push(host_addr);
            self.data_provider.get_many({'ip_addr': host_addr}) // try to use as ip_addr
                 .then(function(resp) {
                    self.cache[host_addr] = {
                        'line': resp.data[0].line.name,
                        'name_ext': resp.data[0].fqdn + '(' + host_addr  + ')'
                    };

                 }, function(resp) {
                    self.unresolved_ip_addrs.push(host_addr);
                 });
        }
    },
    clear_set:
    function(self){
        self.set = [];
    },
    all_hosts_in_one_line:
    function(self){
        var lines_in_set = self.set.map(function(el) {
            if (_.has(self.cache, el)) {
                return self.cache[el].line;
            } else {
                return null;
            }
        });
        if (_.contains(lines_in_set, null)) {
            return false;
        }
        if (_.uniq(lines_in_set).length > 1) {
            return false;
        } else {
            return true;
        }
    },
    get_hosts_tbl_repr:
    function(self){
        return _.uniq(self.set)
        .map(function(el) {
            if (_.has(self.cache, el)) {
                return [self.cache[el].name_ext, self.cache[el].line];
            } else {
                return [el, 'unknown'];
            }
        });
    },

};


app.controller('TestDetailCtrl', function TestsCtrl(
    $scope, $routeParams, $anchorScroll, $filter, $http, $location, $q,
    ngTableParams, toaster, $modal, $log,
    util, logs_provider, data_factory1, shared) {

    _.mixin(_.str.exports());

    $scope.toast_pop = function(status, title, text){
        toaster.pop(status, title, text);
    };

    $scope.call_reduce_job = function () {
    /* Schedule finished test reduce job via REST API.
    */
        var name = 'test_reduce';
        var args = [];
        var kwargs = {
            'test_id': $scope.test_id
        };
        data_factory1.create_job(name, args, kwargs)
            .then(function(resp) {
                if (resp.status === 201) {
                    toaster.pop('success', "Tes reduce job", "successfully scheduled");
                }
            }, function(resp) {data_factory1.handle_error(resp);});
    };

    var adapt_api_resource = function(test) {
        /* Test API resource adaptor.
        */
        test.proj = test.issue.split("-").shift();
        test.started_at_loc = util.utc_to_tbl(test.started_at);
        test.finished_at_loc = util.utc_to_tbl(test.finished_at);
        test.duration = util.duration_hum(test.started_at, test.finished_at);
        test.avatarUrl = getAvatarLink(test.initiator); 
        test.load_src_ext_lnk = get_host_ext_lnk(test.load_src);
        test.load_dst_ext_lnk = get_host_ext_lnk(test.load_dst);
        test.ready_on_client =  true;
        return test;
    };

    var adapt_log_entrie = function(log_e) {
        var lvls = {
            2: 'critical',
            3: 'error',
            4: 'warning',
            6: 'info',
            7: 'debug',
        };
        var el = log_e._source;
        return {
            'timestamp': el.timestamp,
            't_local': util.utc_to_tbl(el.timestamp).local.format('HH:mm:ss'),
            'msg': el.message,
            'facility': el.facility,
            'level': el.level,
            'level_str': lvls[el.level]
        };
    };


    var fetch_logs = function(test_id) {
        var rv = logs_provider.search({
            'env': 'production',
            'test_id': test_id,
        });
        $scope.logs_ui_url = rv.ui_url;
        rv.defer.success(function(data, status, headers, config) {
                $scope.log_entries = data.hits.hits.map(adapt_log_entrie);
            }).
            error(function(data, status, headers, config) {
                console.info('log req err:', status);
            });
    };
    var hosts_from_test = function(test) {
        /*
        * Fetch REST Host resource getting names from test entrie.
        */
        data_factory1.get_host(test.load_src)
            .then(function(resp) {
                $scope.load_src = resp.data;
                $scope.host_to_line[test.load_src] = resp.data.line.name;
            });

        data_factory1.get_host(test.load_dst)
            .then(function(resp) {
                $scope.load_dst = resp.data;
                $scope.host_to_line[test.load_dst] = resp.data.line.name;
            });
    };

    var proc_cfg_hosts = function(load_cfg) {
        /*
        * Get all targets and tanks addr from load_conf,
        * feed them ti LinesManager instance.
        */
        lm1.clear_set(lm1);
        //lm1.clear_set();
        var pahtom_secs = _.filter(_.keys(load_cfg), function(name){ return _(name).startsWith("phantom"); });
        var tgt_names = _.map(pahtom_secs, function(sec){ return load_cfg[sec].address; });
        var src_names = load_cfg.lunaport.tank_fqdn;

        [].concat(tgt_names, src_names)
        .filter(function(el){return el;})
        .map(function(name) {lm1.add_addr(lm1, name);});
    };

    $scope.patch_case = function(attr) {
        var diff = {};
        diff[attr] = $scope.test.id;

        data_factory1.patch_case($scope.test.case_id, diff)
            .then(function(resp) {
                toaster.pop('success', "case resource", "successfully updated");
                var key = attr + '_btn_disabled';
                $scope[key] = true;
            }, function(resp) {data_factory1.handle_error(resp);});
    };
    $scope.open_repeat_modal = function() {
        var modalInstance = $modal.open({
          templateUrl: '/static/tmpl/test/repeat_modal.html',
          controller: RepeatModalCtrl,
          windowClass: 'modal-load-cfg',
          resolve: {
            token_descr: function () {
              return $scope.token_descr;
            }
          }
        });
    };

    $scope.trigger_logs_tbl = function () {
        //if ($scope.flag.display_logs) {
        if ($scope.logs_trigger.current.display) {
            $scope.logs_trigger.current = $scope.logs_trigger.disabled;
            //$scope.flag.display_logs = false;
            //$scope.trigger_logs_txt = '▶ Show'
        } else {
            $scope.logs_trigger.current = $scope.logs_trigger.enabled;
            //$scope.flag.display_logs = true;
            //$scope.trigger_logs_txt = '▼ Hide';
        }
    };

    // main
    var lm1 = new LinesManager(data_factory1);
    //$scope.logs_trigger = {
    $scope.logs_trigger = {
        'enabled': {
            'display': true,
            'btn_txt': '▼ Hide',
        },
        'disabled': {
            'display': false,
            'btn_txt': '▶ Show',
        }
    };
    $scope.logs_trigger.current = $scope.logs_trigger.disabled;
    $scope.flag = {
        't_post_loading': false,
        'display_logs': false,
        'result_has_tags': false
    };

    $scope.t_post_loading = false;
    $scope.host_to_line = {};
    var host_to_line = {};
    var test = null;
    var cfg_case_replace = null;
    if ($routeParams.test_id) {
        $scope.test_id = $routeParams.test_id;
    } else {
        $scope.flag.embedded = true; // controller wasn't called from router.
        $scope.test_id = 42; // default test cfg stored in test #42
    }
    $scope.curr_tag = $routeParams.ammo_tag;

    $scope.test = {};
    $scope.test_stat = {};
    $q.all([
        data_factory1.get_user_ident()
            .then(function(resp) {
                return resp.data;
            }, function(resp) {data_factory1.handle_error(resp);}),
        data_factory1.get_test($scope.test_id)
            .then(function(resp) {
                test = $scope.test = adapt_api_resource(resp.data);
                if (test.status == 'failed') {
                    $scope.logs_trigger.current = $scope.logs_trigger.enabled;
                }
                hosts_from_test(resp.data);
                if (!($scope.flag.embedded)) {
                    fetch_logs(test.id);
                }
                return test;
            }, function(resp) {data_factory1.handle_error(resp);})
    ])
    .then(function(values) {
        if ($scope.flag.embedded) {
            test.generator_cfg.lunaport['case'] = values[0].login + '_sandbox';
        }
    });

    data_factory1.get_test_ammo_tags($scope.test_id)
        .then(function(resp) {
            $scope.stat_tags = resp.data.available_tags;
            if ($scope.stat_tags && $scope.stat_tags.length > 1) {
                $scope.flag.result_has_tags = true; 
                $scope.stat_tags.push('*tags');
            } else {
                $scope.flag.result_has_tags = false; 
            }
        }, function(resp) {data_factory1.handle_error(resp);});


    $scope.$watch('test.case_id', function(new_value){
        if (!(new_value)) {
            return null;
        }
        data_factory1.get_case(new_value)
            .then(function(resp) {
                if ($scope.test.id == resp.data.etalon_test_id) {
                    $scope.etalon_test_id_btn_disabled = true;
                }
                if ($scope.test.id == resp.data.root_test_id) {
                    $scope.root_test_id_btn_disabled = true;
                }
            }, function(resp) {data_factory1.handle_error(resp);});
    }, true);



    var RepeatModalCtrl = function ($scope, $modalInstance) {
        $scope.popover = {
            'test_cfg': CONST.get('test_cfg_popover'),
        };
        $scope.test_posted = null;
        $scope.load_cfg = null;
        $scope.editor = {
            'obj': null,
            'ready_to_save': true,
            'is_changed': 0
        };

        $scope.ace_changed = function() {
            try {
                var load_cfg_obj =  jQuery.parseJSON($scope.editor.obj.getValue());
                proc_cfg_hosts(load_cfg_obj);
                $scope.load_cfg = JSON.stringify(load_cfg_obj, null, "  ");
                $scope.editor.ready_to_save = true;
            } catch(err) {
                $scope.editor.ready_to_save = false;
            }
        };

        $scope.ace_loaded = function(_editor) {
            $scope.editor.obj = _editor;
            $scope.editor.is_ready = true;
            
            if (!($scope.load_cfg)) {
                var load_cfg = _.clone(test.generator_cfg) || {};
                if (!(_.has(load_cfg, 'lunaport'))) {
                    load_cfg.lunaport = {};
                    _.extend(load_cfg.lunaport, {
                        'tank_fqdn': test.load_src,
                        'parent_id': test.id
                    });
                }
                $scope.load_cfg = JSON.stringify(load_cfg, null, "  ");
            }
            $scope.editor.obj.setValue($scope.load_cfg, -1);
            $scope.ace_height = $scope.editor.obj.getSession().getDocument().getLength() * $scope.editor.obj.renderer.lineHeight + $scope.editor.obj.renderer.scrollBar.getWidth();
            $scope.ace_changed();
        };

        $scope.post_force = function (validate_net) {
            // React on 'Start' button pressed
            // Validate cfg hosts lines and create new Test REST resource
            if (validate_net) {
                var net_valid = lm1.all_hosts_in_one_line(lm1);
                if (net_valid === false) {
                    $scope.test_posted = 'warning';
                    $scope.host_to_line = lm1.get_hosts_tbl_repr(lm1);
                    return false;
                }
            }
            $scope.t_post_loading = true;
            data_factory1.post_force($scope.load_cfg)
                .then(function(resp) {
                    $scope.t_post_loading = false;
                    if (resp.status == 201) {
                        $scope.test_posted = true;
                        $scope.test = resp.data;
                        $location.path('/tests/' + parseInt($scope.test.id, 10) + '/all');
                    }
                }, function(resp) {
                    $scope.t_post_loading = false;
                    if ((resp.status == 422) || (resp.status == 500)) {
                        $scope.test_posted = false;
                        $scope.api_error = resp.data;
                    } else {
                        data_factory1.handle_error(resp);
                    }
                });

        };
        $scope.ok = function () {
            $modalInstance.close();
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.back_to_edit = function () {
            $scope.test_posted = null;
        };

    };
    $scope.$watch('[$parent.show_repeat_dialog, test.ready_on_client]', function(values) {
        if ((values[0] > 0) && (values[1])) {
            $scope.open_repeat_modal();
        }
    }, true);
});
