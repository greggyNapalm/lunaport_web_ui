/*global module:false*/
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-templater');
    var js_files = [
        // misc
        "static/js/3d_party/jq/jquery-2.0.3.js",
        "static/js/3d_party/bootstrap/bootstrap.js",
        "static/js/3d_party/bootstrap/affix.js",
        "static/js/3d_party/misc/underscore.js",
        "static/js/3d_party/misc/underscore.string.js",
        "static/js/3d_party/misc/amplify.js",
        "static/js/3d_party/misc/moment.js",
        "static/js/3d_party/misc/mousetrap.js",
        "static/js/3d_party/misc/highlight.min.js",
        "static/js/3d_party/misc/showdown.js",
        "static/js/3d_party/misc/spin.js",
        "static/js/3d_party/misc/ladda.js",
        // angular
        "static/js/3d_party/angular/angular-file-upload-html5-shim.js",
        "static/js/3d_party/angular/angular.js",
        "static/js/3d_party/angular/dist_patched/ui-bootstrap-0.6.0-SNAPSHOT.js",
        "static/js/3d_party/angular/dist_patched/ui-bootstrap-tpls-0.6.0-SNAPSHOT.js",
        "static/js/3d_party/angular/ng-table.src.js",
        "static/js/3d_party/angular/toaster.js",
        "static/js/3d_party/angular/angular-mousetrap.js",
        "static/js/3d_party/angular/ui-ace.js",
        "static/js/3d_party/angular/truncate.js",
        "static/js/3d_party/angular/scrollfix.js",
        "static/js/3d_party/angular/ng-scrollto.js",
        "static/js/3d_party/angular/angular-highlightjs.js",
        "static/js/3d_party/angular/markdown.js",
        "static/js/3d_party/angular/angular-file-upload.js",
        "static/js/3d_party/angular/elastic.js",
        "static/js/3d_party/angular/xeditable.js",
       // lunaport app
        "static/js/app/app.js",
        "static/js/app/routes.js",
        // services 
        "static/js/app/services/runtime_cache.js",
        "static/js/app/services/util.js",
        "static/js/app/services/shared.js",
        "static/js/app/services/alerts_shared.js",
        "static/js/app/services/logs_provider.js",
        // services -> data_factory
        "static/js/app/services/data_factory1/base.js",
        "static/js/app/services/data_factory1/mix_in_error_hndl.js",
        "static/js/app/services/data_factory1/mix_in_test.js",
        "static/js/app/services/data_factory1/mix_in_job.js",
        "static/js/app/services/data_factory1/mix_in_case.js",
        "static/js/app/services/data_factory1/mix_in_notification.js",
        "static/js/app/services/data_factory1/mix_in_eval.js",
        "static/js/app/services/data_factory1/mix_in_issue.js",
        "static/js/app/services/data_factory1/mix_in_token.js",
        "static/js/app/services/data_factory1/mix_in_status.js",
        "static/js/app/services/data_factory1/mix_in_host.js",
        "static/js/app/services/data_factory1/mix_in_ammo.js",
        "static/js/app/services/data_factory1/mix_in_user.js",
        "static/js/app/services/data_factory1/mix_in_hook.js",
        // directives 
        "static/js/app/directives/scroll_spy.js",
        "static/js/app/directives/ladda.js",
        "static/js/app/directives/scroll_spy.js",
        "static/js/app/directives/misc.js",
        // controllers  
        "static/js/app/controllers/notfound.js",
        "static/js/app/controllers/version.js",
        "static/js/app/controllers/settings.js",
        "static/js/app/controllers/alert.js",
        "static/js/app/controllers/issue_detail.js",
        "static/js/app/controllers/status.js",
        // controllers -> test
        "static/js/app/controllers/test/list.js",
        "static/js/app/controllers/test/detail.js",
        "static/js/app/controllers/test/detail_statistics.js",
        "static/js/app/controllers/test/detail_statistics_tags.js",
        "static/js/app/controllers/test/detail_evaluation.js",
        "static/js/app/controllers/test/detail_arts.js",
        "static/js/app/controllers/test/import.js",
        // controllers -> case
        "static/js/app/controllers/case/list.js",
        "static/js/app/controllers/case/detail.js",
        "static/js/app/controllers/case/edit.js",
        "static/js/app/controllers/case/new.js",
        "static/js/app/controllers/case/new.js",
        "static/js/app/controllers/case/hooks.js",
        // controllers -> ammo
        "static/js/app/controllers/ammo/list.js",
        "static/js/app/controllers/ammo/detail.js"
    ];
    var build_num = process.env.DASH_BUILD_NUM || new Date().getTime();
    grunt.initConfig({
        pkg: {
            name: 'Lunaport UI',
            version: '0.0.1',
        },
        build: {
            num: build_num,
            artefact_js:  ['build', build_num, 'app.min.js'].join('/'),
            artefact_css:  ['build', build_num, 'app.min.css'].join('/'),
        },
        js_all: js_files,
        cssmin: {
            combine: {
                files: {
                    '<%= build.artefact_css %>': [
                        "static/css/bootstrap/bootstrap.css", 
                        "static/css/bootstrap/docs.css",
                        "static/css/bootstrap/pygments-manni.css",
                        "static/css/ng-table.css",
                        "static/css/toaster.css",
                        "static/css/lunaport.css",
                        "static/css/highlightjs-github.css",
                        "static/css/ladda-themeless.css",
                        "static/css/xeditable.css"
                    ]
                }
            }
        },
        ngtemplates:  {
          Lunaport: {
            options: {
              concat: 'dist' // Name of concat target to append to
            },
            src: 'static/tmpl/*/*.html',
            dest: '_tmp/templates.js'
          }
        },
        concat: {
          dist: {
            src : ['<%= js_all %>'],
            dest: '_tmp/app.concat.js'
          }
        },
        uglify: {
            options: {
                mangle: false,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= build.num %> -' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            my_target: {
                files: {
                    '<%= build.artefact_js %>': ['<%= concat.dist.dest %>']
                }
            }
        },
        template: {
            prod: {
              src: 'static/tmpl/index.hb',
              dest: 'index.html',
              variables: {
                artefact_css: '<%= build.artefact_css %>',
                artefact_js: '<%= build.artefact_js %>'
              }
            },
            debug: {
              src: 'static/tmpl/index.hb',
              dest: 'index.html',
              variables: {
                app_js_path: '_tmp/app.concat.js'
              }
            }
        },
        clean: ["_tmp"]
    });
    grunt.registerTask('default', ['cssmin', 'ngtemplates', 'concat', 'uglify', 'template:prod', 'clean']);
    //grunt.registerTask('default', ['cssmin', 'ngtemplates', 'concat', 'uglify', 'template:prod']);
};
