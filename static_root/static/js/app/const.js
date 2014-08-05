/* JSHint strict mode tweak */
/*global $:false */
/*global Ember:false */
/*global Mousetrap:false */
/*global console:false */

/* constant variables */
var CONST = (function() {
	'use strict';
    var priv = {
        //'ENVIRONMENT': 'BUILD_DEVELOPMENT_ENV',
        //'ENVIRONMENT': 'lunaport-dev',
        'ENVIRONMENT': 'production',
        'TAG': 'BUILD_GIT_TAG',
        'API_URL': {
            'LOGS': 'http://lunaport-log.domain.org:9200/_search',
        },
        'DELIM_LINKS': ",",
        'DELIM_LINK_PARAM':  ";",
        'LINKS': {
            'jira_base': 'https://jira.domain.org/',
            'wiki': {
                'proj': 'http://wiki.domain.ru/GrigorijjKomissarov/luna-port',
            },
            'issues': 'https://lnk',
            'vcs_web': 'https://lnk',
            'logview_base': 'http://lnk',
            'sentry': 'http://lnk',
            'load_test_arts_proxy': 'http://lnk'
        }
    };
    priv.user_quantiles_popover =
    'Распределение времён ответов расчитаное по указаным пользователем квантилям.' +
    '<ul>' +
    '<li>Квантили в миллисекундах</li>' +
    '<li>Перцентиль соответствующий квантилю</li>' +
    '<li>Процент кол-ва запросов в чанке от общего кол-ва</li>' +
    '<li>Кол-во запросов в чанке</li>' +
    '</ul>' +
    '<a href="http://wiki.domain.ru/GrigorijjKomissarov/luna-port/web_ui_descr/tables#distributionofresponsetimes-userquantiles">Read more</a>';

    priv.standart_percentiles_popover =
    'Распределение времён ответов расчитаное по стандартным перцентилям.' +
    '<ul>' +
    '<li>Квантили в миллисекундах</li>' +
    '<li>Перцентиль соответствующий квантилю</li>' +
    '<li>Процент кол-ва запросов в чанке от общего кол-ва</li>' +
    '<li>Кол-во запросов в чанке</li>' +
    '</ul>' +
    '<a href="http://wiki.domain.ru/GrigorijjKomissarov/luna-port/web_ui_descr/tables#distributionofresponsetimes-standartpercentiles">Read more</a>';

    priv.errno_popover =
    'Распределение кодов возврата(errno) в Фантоме.' +
    '<ul>' +
    '<li>Код</li>' +
    '<li>Процент вызовов вернувших данный кода от общего кол-ва</li>' +
    '<li>Кол-во вызовов вернувших данный код</li>' +
    '</ul>' +
    '<a href="http://wiki.domain.ru/GrigorijjKomissarov/luna-port/web_ui_descr/tables#distributionofphantomsocketerrno">Read more</a>';

    priv.http_popover =
    'Распределение статус кодов HTTP ответов.' +
    '<ul>' +
    '<li>Код</li>' +
    '<li>Процент ответов с данным кодом от общего кол-ва</li>' +
    '<li>Кол-во ответов с данным кодом</li>' +
    '</ul>' +
    '<a href="http://wiki.domain.ru/GrigorijjKomissarov/luna-port/web_ui_descr/tables#distributionofhttpresponsesstatuscodes">Read more</a>';

    priv.rtt_fracts_popover =
    'Процентное соотношение каждой фракции <a href="http://en.wikipedia.org/wiki/Round-trip_delay_time">RTT</a> к значению RTT.' +
    '<ul>' +
    '<li>Имя фракции</li>' +
    '<li>Процент длительности данной фракции от длительности RTT</li>' +
    '</ul>' +
    'connecting + sending + waiting + receiving = RTT<br><br>' +
    'В рамках одного HTTP запроса фракции имеют следующий смысл:<br>' +
    '<b>connecting</b> - от вызова socket.connect до момента посылки первого байта<br>' +
    '<b>sending</b> - от момента послыки первого байта до момента посылки последнего байта из клиентского запроса<br>' +
    '<b>waiting</b> - от момента посылки последнего байта из клиентского запроса до момента приёма первого байта из ответа сервера<br>' +
    '<b>receiving</b> - от момента получения первого байта из ответа сервера до момента получения последнего<br>' +
    '<br>' +
    '<a href="http://wiki.domain.ru/GrigorijjKomissarov/luna-port/web_ui_descr/tables#rrtfractions">Read more</a>';

    priv.evaluantion_popover =
    'Валидация результата теста<br>' +
    'Тест может быть валедирован многократно с разнымми правилами валидации(oracle)' +
    '<ul>' +
    '<li>Имя функции валидатора</li>' +
    '<li>Бинарный результат выполнения true/false</li>' +
    '<li>Человекочитаемый результат выполнения</li>' +
    '<li>С какими аргументами была вызвана функция валидатор</li>' +
    '<li>С какими именованными аргументами была вызвана функция валидатор</li>' +
    '</ul>' +
    '<br>' +
    '<a href="http://wiki.domain.ru/GrigorijjKomissarov/luna-port/web_ui_descr/tables#evaluantion">Read more</a>';

    priv.evaluantions_available_popover =
    'Список завершённых задач по валидации результатов теста<br>' +
    '<ul>' +
    '<li>Уникальный идентификатор проверки(evaluation)</li>' +
    '<li>Булевое значение, будет истинным, если все функции валидаторы вернули true</li>' +
    '<li>Временная метка момента создания сущьности проверки</li>' +
    '</ul>' +
    '<br>' +
    '<a href="http://wiki.domain.ru/GrigorijjKomissarov/luna-port/web_ui_descr/tables#availabletestevaluantions">Read more</a>';

    priv.arts_popover =
    'Возвращает список ресурсов доступных через вызов Tank API tank_api->logs c ссылками.<br>' +
    'Артефакты представляют из себя файлы, которые можно скачать и получить исходную информацию для аналитики.<br>' +
    'answ.log содержит полный лог запрос-ответ в текстовом формате.<br>' +
    '<br>' +
    '<a href="http://wiki.domain.ru/GrigorijjKomissarov/luna-port/web_ui_descr/tables#availabletestevaluantions">Read more</a>';

    priv.test_cfg_popover =
    'Конфиг утилиты Yandex.Tank с дополнениями сервиса Лунапорт, вы можете:<br>' +
    '<li>Просмотреть конифг с которым был запущен текущий тест.</li>' +
    '<li>Поправить конфиг и нажать на кнопку Start  - будет запущен новый тест.</li>' +
    '<br>' +
    '<a href="http://yandextank.readthedocs.org/en/latest/configuration.html#advanced-configuration">Синтаксис</a>';

    priv.oracle_popover =
    'Правила валидации результатов теста.<br>' + 
    'Все тесты запущенные в рамках данного кейса будут подвергнуты валидации по завершении, <br>' + 
    'в зависимости от вердикта тест будет подсвечен красным/зеленым.<br>' +
    'Если вы принимаете решение о годности теста самостоятельно, правила можно игнорировать.<br>' +
    '<br>' +
    '<a href="https://wiki.domain.ru/GrigorijjKomissarov/luna-port/domain">Предметная область</a>  · ' +
    '<a href="https://wiki.domain.ru/GrigorijjKomissarov/luna-port/asserts">Правила валидации</a>';

    priv.root_etalon_test_popover =
    'Ссылки на тесты проведенные в рамках данного кейса:<br>' + 
    '<li>root - корневой, тест с самой актуальной конфигурацией.</li>' +
    '<li>etalon - тест с эталонным для данного кейса результатом, <b>пока не используется</b>.</li>'

     return {
        get: function(name) { return priv[name]; }
    };
})();
