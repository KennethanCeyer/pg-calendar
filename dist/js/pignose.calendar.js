(function (root, factory) {
    if (typeof define !== 'undefined' && define.amd) {
        // AMD loader type declaration.
        define(['jquery', 'moment'], function(jquery, moment) {
            factory(window, document, jquery, moment);
        });
    }
    else if (typeof module === 'object') {
        var jsdom = require('jsdom').jsdom;
        var _document = jsdom('<html></html>', {});
        var _window = _document.defaultView;
        var _jquery = require('jquery')(_window);
        var _moment = require('moment');
        module.exports = factory(_window, _document, _jquery, _moment);
    }
    else {
        root.pignoseCalendar = factory(window, document, jQuery, moment);
    }
}(this, function (window, document, jquery, moment) {
/**
 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    //Creates a parts array for a relName where first part is plugin ID,
    //second part is resource ID. Assumes relName has already been normalized.
    function makeRelParts(relName) {
        return relName ? splitPrefix(relName) : [];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relParts) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0],
            relResourceName = relParts[1];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relResourceName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relResourceName));
            } else {
                name = normalize(name, relResourceName);
            }
        } else {
            name = normalize(name, relResourceName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i, relParts,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;
        relParts = makeRelParts(relName);

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relParts);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, makeRelParts(callback)).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});



define('component/models',[], function () {
    var Model = {
        ComponentName: 'pignoseCalendar',
        ComponentVersion: '1.4.23',
        ComponentPreference: {
            supports: {
                themes: ['light', 'dark', 'blue']
            }
        }
    };
    return Model;
});
//# sourceMappingURL=models.js.map
;


define('component/helper',['./models'], function (Models) {
    var m_formatCache = {};
    var m_classCache = {};
    var m_subClassCache = {};
    var m_regex_upper = /[A-Z]/;

    var Helper = function Constructor() {};

    Helper.Format = function (format) {
        if (!format) {
            return '';
        } else {
            var args = Array.prototype.slice.call(arguments, 1);
            var key = format + args.join('.');

            if (m_formatCache[key]) {
                return m_formatCache[key];
            } else {
                var len = args.length;
                for (var idx = 0; idx < len; idx++) {
                    var value = args[idx];
                    format = format.replace(new RegExp('((?!\\\\)?\\{' + idx + '(?!\\\\)?\\})', 'g'), value);
                }
                format = format.replace(new RegExp('\\\\{([0-9]+)\\\\}', 'g'), '{$1}');
            }
            m_formatCache[key] = format;
            return format;
        }
    };

    Helper.GetClass = function (name) {
        var key = [Models.ComponentName, name].join('.');

        if (m_classCache[key]) {
            return m_classCache[key];
        } else {
            var chars = name.split('');
            var classNames = [];
            var len = chars.length;

            for (var idx = 0, pos = 0; idx < len; idx++) {
                var char = chars[idx];
                if (m_regex_upper.test(char) === true) {
                    classNames[pos++] = '-';
                    char = char.toString().toLowerCase();
                }
                classNames[pos++] = char;
            }

            var className = classNames.join('');
            m_classCache[key] = className;
            return className;
        }
    };

    Helper.GetSubClass = function (name) {
        if (name && name.length) {
            var names = name.split('');
            names[0] = names[0].toUpperCase();
            name = names.join('');
        }

        if (!m_subClassCache[name]) {
            m_subClassCache[name] = Helper.GetClass(Helper.Format('{0}{1}', Models.ComponentName, name));
        }
        return m_subClassCache[name];
    };

    return Helper;
});
//# sourceMappingURL=helper.js.map
;


define('shim/utils',[], function () {
    return {
        register: function register(name, install, lib) {
            if (!lib) {
                var message = 'PIGNOSE Calendar needs ' + name + ' library.\nIf you want to use built-in plugin, Import dist/pignose.calendar.full.js.\nType below code in your command line to install the library.';

                if (console && typeof console.error === 'function') {
                    console.warn(message);
                    console.warn('$ ' + install);
                }
            }
            return lib;
        }
    };
});
//# sourceMappingURL=utils.js.map
;


define('moment',['./shim/utils'], function (Utils) {
    var lib = void 0;
    try {
        lib = moment;
    } catch (e) {
        ;
    }
    return Utils.register('moment', 'npm install moment --save', lib);
});
//# sourceMappingURL=moment.js.map
;


define('manager/index',['../component/helper', 'moment'], function (Helper, moment) {
    var m_dateCache = {};
    var DateManager = function Constructor(date) {
        if (!date) {
            throw new Error('first parameter `date` must be gave');
        }

        if (date instanceof moment === false) {
            if (typeof date === 'string' || typeof date === 'number') {
                date = moment(date);
            } else {
                throw new Error('`date` option is invalid type. (date: ' + date + ').');
            }
        }

        this.year = parseInt(date.format('YYYY'), 10);
        this.month = parseInt(date.format('MM'), 10);
        this.prevMonth = parseInt(date.clone().add(-1, 'months').format('MM'), 10);
        this.nextMonth = parseInt(date.clone().add(1, 'months').format('MM'), 10);
        this.day = parseInt(date.format('DD'), 10);
        this.firstDay = 1;
        this.lastDay = parseInt(date.clone().endOf('month').format('DD'), 10);
        this.weekDay = date.weekday();
        this.date = date;
    };

    DateManager.prototype.toString = function () {
        return this.date.format('YYYY-MM-DD');
    };

    DateManager.Convert = function (year, month, day) {
        var date = Helper.Format('{0}-{1}-{2}', year, month, day);
        if (!m_dateCache[date]) {
            m_dateCache[date] = moment(date, 'YYYY-MM-DD');
        }
        return m_dateCache[date];
    };

    return DateManager;
});
//# sourceMappingURL=index.js.map
;


define('component/classNames',['../component/helper'], function (Helper) {
    return {
        top: Helper.GetSubClass('top'),
        header: Helper.GetSubClass('header'),
        body: Helper.GetSubClass('body'),
        button: Helper.GetSubClass('button')
    };
});
//# sourceMappingURL=classNames.js.map
;


define('configures/i18n',[], function () {
    return {
        supports: ['en', 'ko', 'fr', 'ch', 'de', 'jp', 'pt', 'da', 'pl', 'es', 'cs'],
        weeks: {
            en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            ko: ['일', '월', '화', '수', '목', '금', '토'],
            fa: ['شنبه', 'آدینه', 'پنج', 'چهار', 'سه', 'دو', 'یک'],
            fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
            ch: ['日', '一', '二', '三', '四', '五', '六'],
            de: ['SO', 'MO', 'DI', 'MI', 'DO', 'FR', 'SA'],
            jp: ['日', '月', '火', '水', '木', '金', '土'],
            pt: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
            da: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
            pl: ['Nie', 'Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob'],
            es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            it: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
            cs: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So']
        },
        monthsLong: {
            en: ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'],
            ko: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            fa: ['آذر', 'آبان', 'مهر', 'شهریور', 'مرداد', 'تیر', 'خرداد', 'اردیبهشت', 'فروردین', 'اسفند', 'بهمن', 'دی'],
            fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            ch: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            jp: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            da: ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'],
            pl: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
            es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
            cs: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Cervenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec']
        },
        months: {
            en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            ko: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            fa: ['آذر', 'آبان', 'مهر', 'شهریور', 'مرداد', 'تیر', 'خرداد', 'اردیبهشت', 'فروردین', 'اسفند', 'بهمن', 'دی'],
            fr: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
            ch: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
            jp: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            pt: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            da: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
            pl: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
            es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'],
            it: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
            cs: ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro']
        }
    };
});
//# sourceMappingURL=i18n.js.map
;


define('component/global',['../configures/i18n'], function (languages) {
    return {
        language: 'en',
        languages: languages,
        week: 0,
        format: 'YYYY-MM-DD'
    };
});
//# sourceMappingURL=global.js.map
;


define('component/options',['./global'], function (Global) {
    return {
        lang: null,
        languages: Global.languages,
        theme: 'light',
        date: moment(),
        format: Global.format,
        enabledDates: [],
        disabledDates: [],
        disabledWeekdays: [],
        disabledRanges: [],
        schedules: [],
        scheduleOptions: {
            colors: {}
        },
        week: Global.week,
        weeks: Global.languages.weeks.en,
        monthsLong: Global.languages.monthsLong.en,
        months: Global.languages.months.en,
        pickWeeks: false,
        initialize: true,
        multiple: false,
        toggle: false,
        reverse: false,
        buttons: false,
        modal: false,
        selectOver: false,
        minDate: null,
        maxDate: null,

        /********************************************
         * EVENTS
         *******************************************/
        init: null,
        select: null,
        apply: null,
        click: null,
        page: null,
        prev: null,
        next: null
    };
});
//# sourceMappingURL=options.js.map
;


define('jquery',['./shim/utils'], function (Utils) {
    var lib = void 0;
    try {
        lib = jQuery || $;
    } catch (e) {
        ;
    }
    return Utils.register('jquery', 'npm install jquery --save', lib);
});
//# sourceMappingURL=jquery.js.map
;


define('methods/configure',['../component/global', '../component/models', '../component/options', '../configures/i18n', 'jquery', 'moment'], function (Global, Models, Options, language, $, moment) {
    return function (settings) {
        var context = this;settings;

        context.settings = $.extend(true, {}, Options, settings);

        if (!context.settings.lang) {
            context.settings.lang = Global.language;
        }

        if (context.settings.lang !== 'en' && $.inArray(context.settings.lang, Global.languages.supports) !== -1) {
            context.settings.weeks = Global.languages.weeks[context.settings.lang];
            context.settings.monthsLong = Global.languages.monthsLong[context.settings.lang];
            context.settings.months = Global.languages.months[context.settings.lang];
        }

        if (context.settings.theme !== 'light' && $.inArray(context.settings.theme, Models.ComponentPreference.supports.themes) === -1) {
            context.settings.theme = 'light';
        }

        if (context.settings.pickWeeks === true) {
            if (context.settings.multiple === false) {
                console.error('You must give true at settings.multiple options on PIGNOSE-Calendar for using in pickWeeks option.');
            } else if (context.settings.toggle === true) {
                console.error('You must give false at settings.toggle options on PIGNOSE-Calendar for using in pickWeeks option.');
            }
        }

        context.settings.week %= context.settings.weeks.length;
    };
});
//# sourceMappingURL=configure.js.map
;


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define('methods/init',['../manager/index', '../component/classNames', '../component/helper', '../component/models', '../component/global', './configure', 'jquery', 'moment'], function (DateManager, ClassNames, Helper, Models, Global, MethodConfigure, $, moment) {
    var $window = $(window);
    var $document = $(document);

    return function (options) {
        var context = this;

        context.settings = {};
        MethodConfigure.call(context, options);

        context.global = {
            calendarHtml: Helper.Format('<div class="{0} {0}-{4}">\
                                            <div class="{1}">\
                                                <a href="#" class="{1}-nav {1}-prev">\
                                                    <span class="icon-arrow-left {1}-icon"></span>\
                                                </a>\
                                                <div class="{1}-date">\
                                                    <span class="{1}-month"></span>\
                                                    <span class="{1}-year"></span>\
                                                </div>\
                                                <a href="#" class="{1}-nav {1}-next">\
                                                    <span class="icon-arrow-right {1}-icon"></span>\
                                                </a>\
                                            </div>\
                                            <div class="{2}"></div>\
                                            <div class="{3}"></div>\
                                        </div>', Helper.GetClass(Models.ComponentName), ClassNames.top, ClassNames.header, ClassNames.body, context.settings.theme),
            calendarButtonsHtml: Helper.Format('<div class="{0}-group">\
                                                    <a href="#" class="{0} {0}-cancel">Cancel</a>\
                                                    <a href="#" class="{0} {0}-apply">OK</a>\
                                                </div>', ClassNames.button),
            calendarScheduleContainerHtml: Helper.Format('<div class="{0}-schedule-container"></div>', ClassNames.button),
            calendarSchedulePinHtml: Helper.Format('<span class="{0}-schedule-pin {0}-schedule-pin-\\{0\\}" style="background-color: \\{1\\};"></span>', ClassNames.button)
        };

        var rangeClass = Helper.GetSubClass('unitRange');
        var rangeFirstClass = Helper.GetSubClass('unitRangeFirst');
        var rangeLastClass = Helper.GetSubClass('unitRangeLast');
        var activeClass = Helper.GetSubClass('unitActive');
        var activePositionClasses = [Helper.GetSubClass('unitFirstActive'), Helper.GetSubClass('unitSecondActive')];
        var toggleActiveClass = Helper.GetSubClass('unitToggleActive');
        var toggleInactiveClass = Helper.GetSubClass('unitToggleInactive');
        var $calendarButton = null;

        return context.each(function () {
            var $this = $(this);
            var local = {
                initialize: null,
                element: $this,
                calendar: $(context.global.calendarHtml),
                input: $this.is('input'),
                renderer: null,
                current: [null, null],
                date: {
                    all: [],
                    enabled: [],
                    disabled: []
                },
                storage: {
                    activeDates: [],
                    schedules: []
                },
                dateManager: new DateManager(context.settings.date),
                calendarWrapperHtml: Helper.Format('<div class="{0}"></div>', Helper.GetSubClass('wrapper')),
                calendarWrapperOverlayHtml: Helper.Format('<div class="{0}"></div>', Helper.GetSubClass('wrapperOverlay')),
                context: context
            };
            var $parent = $this;
            var len = void 0;

            if (context.settings.initialize === true) {
                local.initialize = local.current[0] = local.dateManager.date.clone();
            }

            this.local = local;

            if (context.settings.reverse === true) {
                local.calendar.addClass(Helper.GetSubClass('reverse'));
            } else {
                local.calendar.addClass(Helper.GetSubClass('default'));
            }

            for (var i = context.settings.week; i < context.settings.weeks.length + context.settings.week; i++) {
                if (i < 0) {
                    i = Global.languages.weeks.en.length - i;
                }
                var week = context.settings.weeks[i % context.settings.weeks.length];
                if (typeof week !== 'string') {
                    continue;
                }
                week = week.toUpperCase();
                var $unit = $(Helper.Format('<div class="{0} {0}-{2}">{1}</div>', Helper.GetSubClass('week'), week, Global.languages.weeks.en[i % Global.languages.weeks.en.length].toLowerCase()));
                $unit.appendTo(local.calendar.find('.' + ClassNames.header));
            }

            if (context.settings.buttons === true) {
                $calendarButton = $(context.global.calendarButtonsHtml);
                $calendarButton.appendTo(local.calendar);
            }

            if (local.input === true || context.settings.modal === true) {
                var wrapperActiveClass = Helper.GetSubClass('wrapperActive');
                var overlayActiveClass = Helper.GetSubClass('wrapperOverlayActive');
                var $overlay = void 0;

                $parent = $(local.calendarWrapperHtml);
                $parent.bind('click', function (event) {
                    event.stopPropagation();
                });

                $this.bind('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    $overlay = $('.' + Helper.GetSubClass('wrapperOverlay'));

                    if ($overlay.length < 1) {
                        $overlay = $(local.calendarWrapperOverlayHtml);
                        $overlay.appendTo('body');
                    }

                    $overlay.unbind('click.' + Helper.GetClass(Models.ComponentName)).bind('click.' + Helper.GetClass(Models.ComponentName), function (event) {
                        event.stopPropagation();
                        $parent.trigger('cancel.' + Helper.GetClass(Models.ComponentName));
                    });

                    if ($parent.parent().is('body') === false) {
                        $parent.appendTo('body');
                    }

                    $parent.show();
                    $overlay.show();

                    $window.unbind('resize.' + Helper.GetClass(Models.ComponentName)).bind('resize.' + Helper.GetClass(Models.ComponentName), function () {
                        $parent.css({
                            marginLeft: -$parent.outerWidth() / 2,
                            marginTop: -$parent.outerHeight() / 2
                        });
                    }).triggerHandler('resize.' + Helper.GetClass(Models.ComponentName));

                    $this[Models.ComponentName]('set', $this.val());

                    setTimeout(function () {
                        $overlay.addClass(overlayActiveClass);
                        $parent.addClass(wrapperActiveClass);
                    }, 25);
                }).bind('focus', function (event) {
                    var $this = $(this);
                    $this.blur();
                });

                $parent.unbind('cancel.' + Helper.GetClass(Models.ComponentName) + ' ' + 'apply.' + Helper.GetClass(Models.ComponentName)).bind('cancel.' + Helper.GetClass(Models.ComponentName) + ' ' + 'apply.' + Helper.GetClass(Models.ComponentName), function () {
                    $overlay.removeClass(overlayActiveClass).hide();
                    $parent.removeClass(wrapperActiveClass).hide();
                });
            }

            var generateDateRange = function generateDateRange() {
                if (!local.current[0] || !local.current[1]) {
                    return false;
                }

                var firstSelectDate = local.current[0].format('YYYY-MM-DD');
                var lastSelectDate = local.current[1].format('YYYY-MM-DD');
                var firstDate = moment(Math.max(local.current[0].valueOf(), local.dateManager.date.clone().startOf('month').valueOf()));
                var lastDate = moment(Math.min(local.current[1].valueOf(), local.dateManager.date.clone().endOf('month').valueOf()));
                var firstDateIsUndered = firstDate.format('YYYY-MM-DD') !== firstSelectDate;
                var lastDateIsOvered = lastDate.format('YYYY-MM-DD') !== lastSelectDate;

                if (firstDateIsUndered === false) {
                    firstDate.add(1, 'days');
                }

                if (lastDateIsOvered === false) {
                    lastDate.add(-1, 'days');
                }

                var firstDateFixed = firstDate.format('YYYY-MM-DD');
                var lastDateFixed = lastDate.format('YYYY-MM-DD');

                for (; firstDate.format('YYYY-MM-DD') <= lastDate.format('YYYY-MM-DD'); firstDate.add(1, 'days')) {
                    var date = firstDate.format('YYYY-MM-DD');
                    var isRange = true;
                    var $target = local.calendar.find(Helper.Format('.{0}[data-date="{1}"]', Helper.GetSubClass('unit'), date)).addClass(rangeClass);

                    if (date === firstDateFixed) {
                        $target.addClass(rangeFirstClass);
                    }

                    if (date === lastDateFixed) {
                        $target.addClass(rangeLastClass);
                    }
                }
            };

            var existsBetweenRange = function existsBetweenRange(startDate, endDate, targetDate) {
                if (targetDate) {
                    if (startDate.diff(targetDate) < 0 && endDate.diff(targetDate) > 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            };

            var validDate = function validDate(date) {
                if (context.settings.disabledDates.indexOf(date) !== -1) {
                    return false;
                }

                if (date.diff(context.settings.maxDate) >= 0) {
                    return false;
                }

                if (date.diff(context.settings.minDate) <= 0) {
                    return false;
                }

                for (var idx in context.settings.disabledRanges) {
                    var rangeDate = context.settings.disabledRanges[idx];
                    var startRangeDate = moment(rangeDate[0]);
                    var endRangeDate = moment(rangeDate[1]);

                    if (existsBetweenRange(startRangeDate, endRangeDate, date)) {
                        return false;
                    }
                }

                var weekday = date.weekday();
                if (context.settings.disabledWeekdays.indexOf(weekday) !== -1) {
                    return false;
                }

                return true;
            };

            var validDateArea = function validDateArea(startDate, endDate) {
                var date = void 0;

                for (var idx in context.settings.disabledDates) {
                    date = moment(context.settings.disabledDates[idx]);
                    if (existsBetweenRange(startDate, endDate, date)) {
                        return false;
                    }
                }

                if (existsBetweenRange(startDate, endDate, context.settings.maxDate)) {
                    return false;
                }

                if (existsBetweenRange(startDate, endDate, context.settings.minDate)) {
                    return false;
                }

                for (var _idx in context.settings.disabledRanges) {
                    var rangeDate = context.settings.disabledRanges[_idx];
                    var startRangeDate = moment(rangeDate[0]);
                    var endRangeDate = moment(rangeDate[1]);

                    if (existsBetweenRange(startDate, endDate, startRangeDate) || existsBetweenRange(startDate, endDate, endRangeDate)) {
                        return false;
                    }
                }

                var startWeekday = startDate.weekday();
                var endWeekday = endDate.weekday();
                var tmp = void 0;

                if (startWeekday > endWeekday) {
                    tmp = startWeekday;
                    startWeekday = endWeekday;
                    endWeekday = tmp;
                }

                for (var _idx2 = 0, index = 0; _idx2 < context.settings.disabledWeekdays.length && index < 7; _idx2++) {
                    index++;
                    var _week = context.settings.disabledWeekdays[_idx2];

                    if (_week >= startWeekday && _week <= endWeekday) {
                        return false;
                    }
                }

                return true;
            };

            local.renderer = function () {
                local.calendar.appendTo($parent.empty());
                local.calendar.find('.' + ClassNames.top + '-year').text(local.dateManager.year);
                local.calendar.find('.' + ClassNames.top + '-month').text(context.settings.monthsLong[local.dateManager.month - 1]);
                local.calendar.find(Helper.Format('.{0}-prev .{0}-value', ClassNames.top)).text(context.settings.months[local.dateManager.prevMonth - 1].toUpperCase());
                local.calendar.find(Helper.Format('.{0}-next .{0}-value', ClassNames.top)).text(context.settings.months[local.dateManager.nextMonth - 1].toUpperCase());

                if (context.settings.buttons === true && $calendarButton) {
                    var $super = $this;
                    $calendarButton.find('.' + ClassNames.button).bind('click', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        var $this = $(this);

                        if ($this.hasClass(ClassNames.button + '-apply')) {
                            $this.trigger('apply.' + Models.ComponentName, local);
                            var value = '';
                            if (context.settings.toggle === true) {
                                value = local.storage.activeDates.join(', ');
                            } else if (context.settings.multiple === true) {
                                var dateValues = [];

                                if (local.current[0] !== null) {
                                    dateValues.push(local.current[0].format(context.settings.format));
                                }

                                if (local.current[1] !== null) {
                                    dateValues.push(local.current[1].format(context.settings.format));
                                }

                                value = dateValues.join(' ~ ');
                            } else {
                                value = local.current[0] === null ? '' : moment(local.current[0]).format(context.settings.format);
                            }

                            if (local.input === true) {
                                $super.val(value).triggerHandler('change');
                            }

                            if (typeof context.settings.apply === 'function') {
                                context.settings.apply.call(local.calendar, local.current, local);
                            }
                            $parent.triggerHandler('apply.' + Helper.GetClass(Models.ComponentName));
                        } else {
                            $parent.triggerHandler('cancel.' + Helper.GetClass(Models.ComponentName));
                        }
                    });
                }

                var $calendarBody = local.calendar.find('.' + ClassNames.body).empty();
                var firstDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, local.dateManager.firstDay);
                var lastDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, local.dateManager.lastDay);
                var firstWeekday = firstDate.weekday() - context.settings.week;
                var lastWeekday = lastDate.weekday() - context.settings.week;

                if (firstWeekday < 0) {
                    firstWeekday += context.settings.weeks.length;
                }

                var $unitList = [],
                    currentFormat = [local.current[0] === null ? null : local.current[0].format('YYYY-MM-DD'), local.current[1] === null ? null : local.current[1].format('YYYY-MM-DD')],
                    minDate = context.settings.minDate === null ? null : moment(context.settings.minDate),
                    maxDate = context.settings.maxDate === null ? null : moment(context.settings.maxDate);

                for (var _i = 0; _i < firstWeekday; _i++) {
                    var $unit = $(Helper.Format('<div class="{0} {0}-{1}"></div>', Helper.GetSubClass('unit'), Global.languages.weeks.en[_i].toLowerCase()));
                    $unitList.push($unit);
                }

                var _loop = function _loop(_i2) {
                    var iDate = DateManager.Convert(local.dateManager.year, local.dateManager.month, _i2);
                    var iDateFormat = iDate.format('YYYY-MM-DD');
                    var $unit = $(Helper.Format('<div class="{0} {0}-date {0}-{3}" data-date="{1}"><a href="#">{2}</a></div>', Helper.GetSubClass('unit'), iDate.format('YYYY-MM-DD'), _i2, Global.languages.weeks.en[iDate.weekday()].toLowerCase()));

                    if (context.settings.enabledDates.length > 0) {
                        if ($.inArray(iDateFormat, context.settings.enabledDates) === -1) {
                            $unit.addClass(Helper.GetSubClass('unitDisabled'));
                        }
                    } else if (context.settings.disabledWeekdays.length > 0 && $.inArray(iDate.weekday(), context.settings.disabledWeekdays) !== -1) {
                        $unit.addClass(Helper.GetSubClass('unitDisabled')).addClass(Helper.GetSubClass('unitDisabledWeekdays'));
                    } else if (minDate !== null && minDate.diff(iDate) > 0 || maxDate !== null && maxDate.diff(iDate) < 0) {
                        $unit.addClass(Helper.GetSubClass('unitDisabled')).addClass(Helper.GetSubClass('unitDisabledRange'));
                    } else if ($.inArray(iDateFormat, context.settings.disabledDates) !== -1) {
                        $unit.addClass(Helper.GetSubClass('unitDisabled'));
                    } else if (context.settings.disabledRanges.length > 0) {
                        var disabledRangesLength = context.settings.disabledRanges.length;
                        for (var j = 0; j < disabledRangesLength; j++) {
                            var disabledRange = context.settings.disabledRanges[j];
                            var disabledRangeLength = disabledRange.length;

                            if (iDate.diff(moment(disabledRange[0])) >= 0 && iDate.diff(moment(disabledRange[1])) <= 0) {
                                $unit.addClass(Helper.GetSubClass('unitDisabled')).addClass(Helper.GetSubClass('unitDisabledRange')).addClass(Helper.GetSubClass('unitDisabledMultipleRange'));
                                break;
                            }
                        }
                    }

                    if (context.settings.schedules.length > 0 && _typeof(context.settings.scheduleOptions) === 'object' && _typeof(context.settings.scheduleOptions.colors) === 'object') {
                        var currentSchedules = context.settings.schedules.filter(function (schedule) {
                            return schedule.date === iDateFormat;
                        });

                        var nameOfSchedules = $.unique(currentSchedules.map(function (schedule, index) {
                            return schedule.name;
                        }).sort());

                        if (nameOfSchedules.length > 0) {
                            //$unit.data('schedules', currentSchedules);
                            var $schedulePinContainer = $(context.global.calendarScheduleContainerHtml);
                            $schedulePinContainer.appendTo($unit);
                            nameOfSchedules.map(function (name, index) {
                                if (context.settings.scheduleOptions.colors[name]) {
                                    var color = context.settings.scheduleOptions.colors[name];
                                    var $schedulePin = $(Helper.Format(context.global.calendarSchedulePinHtml, name, color));
                                    $schedulePin.appendTo($schedulePinContainer);
                                }
                            });
                        }
                    }

                    if (context.settings.toggle === true) {
                        if ($.inArray(iDateFormat, local.storage.activeDates) !== -1 && local.storage.activeDates.length > 0) {
                            $unit.addClass(toggleActiveClass);
                        } else {
                            $unit.addClass(toggleInactiveClass);
                        }
                    } else if ($unit.hasClass(Helper.GetSubClass('unitDisabled')) === false) {
                        if (context.settings.multiple === true) {
                            if (currentFormat[0] && iDateFormat === currentFormat[0]) {
                                $unit.addClass(activeClass).addClass(activePositionClasses[0]);
                            }

                            if (currentFormat[1] && iDateFormat === currentFormat[1]) {
                                $unit.addClass(activeClass).addClass(activePositionClasses[1]);
                            }
                        } else {
                            if (currentFormat[0] && iDateFormat === currentFormat[0] && $.inArray(currentFormat[0], context.settings.disabledDates) === -1 && (context.settings.enabledDates.length < 1 || $.inArray(currentFormat[0], context.settings.enabledDates) !== -1)) {
                                $unit.addClass(activeClass).addClass(activePositionClasses[0]);
                            }
                        }
                    }

                    $unitList.push($unit);
                    var $super = $this;

                    $unit.bind('click', function (event) {
                        event.preventDefault();
                        event.stopPropagation();

                        var $this = $(this);
                        var date = $this.data('date');
                        var position = 0;
                        var preventSelect = false;

                        if ($this.hasClass(Helper.GetSubClass('unitDisabled'))) {
                            preventSelect = true;
                        } else {
                            if (local.input === true && context.settings.multiple === false && context.settings.buttons === false) {
                                $super.val(moment(date).format(context.settings.format));
                                $parent.triggerHandler('apply.' + Helper.GetClass(Models.ComponentName));
                            } else {
                                if (local.initialize !== null && local.initialize.format('YYYY-MM-DD') === date && context.settings.toggle === false) {} else {
                                    if (context.settings.toggle === true) {
                                        var match = local.storage.activeDates.filter(function (e, i) {
                                            return e === date;
                                        });
                                        local.current[position] = moment(date);

                                        if (match.length < 1) {
                                            local.storage.activeDates.push(date);
                                            $this.addClass(toggleActiveClass).removeClass(toggleInactiveClass);
                                        } else {
                                            var index = 0;
                                            for (var idx = 0; idx < local.storage.activeDates.length; idx++) {
                                                var targetDate = local.storage.activeDates[idx];

                                                if (date === targetDate) {
                                                    index = idx;
                                                    break;
                                                }
                                            }
                                            local.storage.activeDates.splice(index, 1);
                                            $this.removeClass(toggleActiveClass).addClass(toggleInactiveClass);
                                        }
                                    } else if ($this.hasClass(activeClass) === true && context.settings.pickWeeks === false) {
                                        if (context.settings.multiple === true) {
                                            if ($this.hasClass(activePositionClasses[0])) {
                                                position = 0;
                                            } else if (activePositionClasses[1]) {
                                                position = 1;
                                            }
                                        }
                                        $this.removeClass(activeClass).removeClass(activePositionClasses[position]);
                                        local.current[position] = null;
                                    } else {
                                        if (context.settings.pickWeeks === true) {
                                            if ($this.hasClass(activeClass) === true || $this.hasClass(rangeClass) === true) {
                                                for (var _j = 0; _j < 2; _j++) {
                                                    local.calendar.find('.' + activeClass + '.' + activePositionClasses[_j]).removeClass(activeClass).removeClass(activePositionClasses[_j]);
                                                }

                                                local.current[0] = null;
                                                local.current[1] = null;
                                            } else {
                                                local.current[0] = moment(date).startOf('week').add(context.settings.week, 'days');
                                                local.current[1] = moment(date).endOf('week').add(context.settings.week, 'days');

                                                for (var _j2 = 0; _j2 < 2; _j2++) {
                                                    local.calendar.find('.' + activeClass + '.' + activePositionClasses[_j2]).removeClass(activeClass).removeClass(activePositionClasses[_j2]);
                                                    local.calendar.find(Helper.Format('.{0}[data-date="{1}"]', Helper.GetSubClass('unit'), local.current[_j2].format('YYYY-MM-DD'))).addClass(activeClass).addClass(activePositionClasses[_j2]);
                                                }
                                            }
                                        } else {
                                            if (context.settings.multiple === true) {
                                                if (local.current[0] === null) {
                                                    position = 0;
                                                } else if (local.current[1] === null) {
                                                    position = 1;
                                                } else {
                                                    position = 0;
                                                    local.current[1] = null;
                                                    local.calendar.find('.' + activeClass + '.' + activePositionClasses[1]).removeClass(activeClass).removeClass(activePositionClasses[1]);
                                                }
                                            }

                                            local.calendar.find('.' + activeClass + '.' + activePositionClasses[position]).removeClass(activeClass).removeClass(activePositionClasses[position]);
                                            $this.addClass(activeClass).addClass(activePositionClasses[position]);
                                            local.current[position] = moment(date);
                                        }

                                        if (local.current[0] && local.current[1]) {
                                            if (local.current[0].diff(local.current[1]) > 0) {
                                                var tmp = local.current[0];
                                                local.current[0] = local.current[1];
                                                local.current[1] = tmp;
                                                tmp = null;

                                                local.calendar.find('.' + activeClass).each(function () {
                                                    var $this = $(this);
                                                    for (var _idx3 in activePositionClasses) {
                                                        var className = activePositionClasses[_idx3];
                                                        $this.toggleClass(className);
                                                    }
                                                });
                                            }

                                            if (validDateArea(local.current[0], local.current[1]) === false && context.settings.selectOver === false) {
                                                local.current[0] = null;
                                                local.current[1] = null;
                                                local.calendar.find('.' + activeClass).removeClass(activeClass).removeClass(activePositionClasses[0]).removeClass(activePositionClasses[1]);
                                            }

                                            if (local.input === true && context.settings.buttons === false) {
                                                var dateValues = [];

                                                if (local.current[0] !== null) {
                                                    dateValues.push(local.current[0].format(context.settings.format));
                                                }

                                                if (local.current[1] !== null) {
                                                    dateValues.push(local.current[1].format(context.settings.format));
                                                }

                                                $this.val(dateValues.join(', '));
                                                $parent.trigger('apply.' + Helper.GetClass(Models.ComponentName));
                                            }
                                        }
                                    }

                                    if (context.settings.multiple === true) {
                                        local.calendar.find('.' + rangeClass).removeClass(rangeClass).removeClass(rangeFirstClass).removeClass(rangeLastClass);
                                        generateDateRange.call();
                                    }

                                    if (context.settings.schedules.length > 0) {
                                        local.storage.schedules = context.settings.schedules.filter(function (event) {
                                            return event.date === date;
                                        });
                                    }
                                }
                            }
                        }

                        var classifyDate = function classifyDate(date) {
                            local.date.all.push(date);
                            if (validDate(moment(date))) {
                                local.date.enabled.push(date);
                            } else {
                                local.date.disabled.push(date);
                            }
                        };

                        if (local.current[0]) {
                            if (local.current[1]) {
                                var startDate = local.current[0];
                                var _date = startDate.clone();

                                for (; _date.format('YYYY-MM-DD') <= local.current[1].format('YYYY-MM-DD'); _date.add('1', 'days')) {
                                    classifyDate(_date.clone());
                                }
                            } else {
                                var _date2 = local.current[0];
                                classifyDate(_date2.clone());
                            }
                        }

                        if (preventSelect === false) {
                            local.initialize = null;

                            if (typeof context.settings.select === 'function') {
                                context.settings.select.call($this, local.current, local);
                            }
                        }

                        if (typeof context.settings.click === 'function') {
                            context.settings.click.call($this, event, local);
                        }
                    });
                };

                for (var _i2 = local.dateManager.firstDay; _i2 <= local.dateManager.lastDay; _i2++) {
                    _loop(_i2);
                }

                for (var _i3 = lastWeekday + 1; $unitList.length < context.settings.weeks.length * 5; _i3++) {
                    if (_i3 < 0) {
                        _i3 = Global.languages.weeks.en.length - _i3;
                    }
                    var _$unit = $(Helper.Format('<div class="{0} {0}-{1}"></div>', Helper.GetSubClass('unit'), Global.languages.weeks.en[_i3 % Global.languages.weeks.en.length].toLowerCase()));
                    $unitList.push(_$unit);
                }

                var $row = null;
                for (var _i4 = 0; _i4 < $unitList.length; _i4++) {
                    var element = $unitList[_i4];
                    if (_i4 % context.settings.weeks.length == 0 || _i4 + 1 >= $unitList.length) {
                        if ($row !== null) {
                            $row.appendTo($calendarBody);
                        }

                        if (_i4 + 1 < $unitList.length) {
                            $row = $(Helper.Format('<div class="{0}"></div>', Helper.GetSubClass('row')));
                        }
                    }
                    $row.append(element);
                }

                local.calendar.find('.' + ClassNames.top + '-nav').bind('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var $this = $(this);
                    var type = 'unkown';

                    if ($this.hasClass(ClassNames.top + '-prev')) {
                        type = 'prev';
                        local.dateManager = new DateManager(local.dateManager.date.clone().add(-1, 'months'));
                    } else if ($this.hasClass(ClassNames.top + '-next')) {
                        type = 'next';
                        local.dateManager = new DateManager(local.dateManager.date.clone().add(1, 'months'));
                    }

                    if (typeof context.settings.page === 'function') {
                        context.settings.page.call($this, {
                            type: type,
                            year: local.dateManager.year,
                            month: local.dateManager.month,
                            day: local.dateManager.day
                        }, local);
                    }

                    if (typeof context.settings[type] === 'function') {
                        context.settings[type].call($this, {
                            type: type,
                            year: local.dateManager.year,
                            month: local.dateManager.month,
                            day: local.dateManager.day
                        }, local);
                    }

                    local.renderer.call();
                });

                if (context.settings.multiple === true) {
                    local.calendar.find('.' + rangeClass).removeClass(rangeClass).removeClass(rangeFirstClass).removeClass(rangeLastClass);
                    generateDateRange.call();
                }
            };

            local.renderer.call();
            $this[0][Models.ComponentName] = local;

            if (typeof context.settings.init === 'function') {
                context.settings.init.call($this, local);
            }
        });
    };
});
//# sourceMappingURL=init.js.map
;


define('methods/setting',['../component/global', 'jquery', 'moment'], function (Global, $, moment) {
    return function (options) {
        var settings = $.extend({
            language: Global.language,
            languages: {},
            week: null,
            format: null
        }, options);
        var monthsCount = 12;
        var weeksCount = 7;

        Global.language = settings.language;

        if (Object.keys(settings.languages).length > 0) {
            var _loop = function _loop(language) {
                var languageSetting = settings.languages[language];

                if (typeof language !== 'string') {
                    console.error('Global configuration is failed.\nMessage: language key is not a string type.', language);
                }

                if (!languageSetting.weeks) {
                    console.error('Global configuration is failed.\nMessage: You must give `weeks` option of `' + language + '` language.');
                    return 'break';
                }

                if (!languageSetting.monthsLong) {
                    console.error('Global configuration is failed.\nMessage: You must give `monthsLong` option of `' + language + '` language.');
                    return 'break';
                }

                if (!languageSetting.months) {
                    console.error('Global configuration is failed.\nMessage: You must give `months` option of `' + language + '` language.');
                    return 'break';
                }

                if (languageSetting.weeks.length < weeksCount) {
                    console.error('`weeks` must have least ' + weeksCount + ' items.');
                    return 'break';
                } else if (languageSetting.weeks.length !== weeksCount) {
                    console.warn('`weeks` option over ' + weeksCount + ' items. We recommend to give ' + weeksCount + ' items.');
                }

                if (languageSetting.monthsLong.length < monthsCount) {
                    console.error('`monthsLong` must have least ' + monthsCount + ' items.');
                    return 'break';
                } else if (languageSetting.monthsLong.length !== monthsCount) {
                    console.warn('`monthsLong` option over ' + monthsCount + ' items. We recommend to give ' + monthsCount + ' items.');
                }

                if (languageSetting.months.length < monthsCount) {
                    console.error('`months` must have least ' + monthsCount + ' items.');
                    return 'break';
                } else if (languageSetting.months.length !== monthsCount) {
                    console.warn('`months` option over ' + monthsCount + ' items. We recommend to give ' + monthsCount + ' items.');
                }

                if (Global.languages.supports.indexOf(language) === -1) {
                    Global.languages.supports.push(language);
                }

                ['weeks', 'monthsLong', 'months'].map(function (key) {
                    if (Global.languages[key][language]) {
                        console.warn('`' + language + '` language is already given however it will be overwriten.');
                    }
                    Global.languages[key][language] = languageSetting[key];
                });
            };

            for (var language in settings.languages) {
                var _ret = _loop(language);

                if (_ret === 'break') break;
            }
        }

        if (settings.week) {
            if (typeof settings.week === 'number') {
                Global.week = settings.week;
            } else {
                console.error('Global configuration is failed.\nMessage: You must give `week` option as number type.');
            }
        }

        if (settings.format) {
            if (typeof settings.format === 'string') {
                Global.format = settings.format;
            } else {
                console.error('Global configuration is failed.\nMessage: You must give `format` option as string type.');
            }
        }
    };
});
//# sourceMappingURL=setting.js.map
;


define('methods/select',['../component/helper', 'jquery', 'moment'], function (Helper, $, moment) {
    return function (day) {
        this.each(function () {
            var local = this.local;
            var dateManager = local.dateManager;
            var date = Helper.Format('{0}-{1}-{2}', dateManager.year, dateManager.month, day);
            $(this).find(Helper.Format('.{0}[data-date="{1}"]', Helper.GetSubClass('unit'), date)).triggerHandler('click');
        });
    };
});
//# sourceMappingURL=select.js.map
;


define('methods/set',['jquery', 'moment', '../manager/index', '../component/models'], function ($, moment, DateManager, Models) {
    return function (date) {
        if (date) {
            var dateSplit = date.split('~').map(function (element) {
                var format = $.trim(element);
                return !format ? null : format;
            });

            this.each(function () {
                var $this = $(this);
                var local = $this[0][Models.ComponentName];
                var context = local.context;

                var dateArray = [!dateSplit[0] ? null : moment(dateSplit[0], context.settings.format), !dateSplit[1] ? null : moment(dateSplit[1], context.settings.format)];
                local.dateManager = new DateManager(dateArray[0]);

                if (context.settings.pickWeeks === true) {
                    if (dateArray[0]) {
                        var _date = dateArray[0];
                        dateArray[0] = _date.clone().startOf('week');
                        dateArray[1] = _date.clone().endOf('week');
                    }
                }

                if (context.settings.toggle === true) {
                    local.storage.activeDates = dateSplit;
                } else {
                    local.current = dateArray;
                }
                local.renderer.call();
            });
        }
    };
});
//# sourceMappingURL=set.js.map
;


define('methods/index',['./init', './configure', './setting', './select', './set'], function (MethodInit, MethodConfigure, MethodSetting, MethodSelect, MethodSet) {
    return {
        init: MethodInit,
        configure: MethodConfigure,
        setting: MethodSetting,
        select: MethodSelect,
        set: MethodSet
    };
});
//# sourceMappingURL=index.js.map
;


define('component/polyfills',[], function () {
    if (!Array.prototype.filter) {
        Array.prototype.filter = function (func) {
            'use strict';

            if (this === null) {
                throw new TypeError();
            }

            var t = Object(this);
            var len = t.length >>> 0;

            if (typeof func !== 'function') {
                return [];
            }

            var res = [];
            var thisp = arguments[1];
            for (var i = 0; i < len; i++) {
                if (i in t) {
                    var val = t[i];
                    if (func.call(thisp, val, i, t)) {
                        res.push(val);
                    }
                }
            }
            return res;
        };
    }
});
//# sourceMappingURL=polyfills.js.map
;


define('core',['./methods/index', './component/models', './component/polyfills'], function (Methods, Models, Polyfills) {
    'use strict';

    window[Models.ComponentName] = {
        VERSION: Models.ComponentVersion
    };

    var Component = Methods;
    return Component;
});
//# sourceMappingURL=core.js.map
;


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define('main',['core', 'component/models'], function (Component, Models) {
    'use strict';

    var PignoseCalendar = function PignoseCalendar(element, options) {
        if (typeof Component[options] !== 'undefined') {
            return Component[options].apply(element, Array.prototype.slice.call(arguments, 2));
        } else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' || !options) {
            return Component.init.apply(element, Array.prototype.slice.call(arguments, 1));
        } else {
            console.error('Argument error are occured.');
        }
    };

    for (var idx in Models) {
        PignoseCalendar[idx] = Models[idx];
    }

    return PignoseCalendar;
});
//# sourceMappingURL=main.js.map
;


define('plugin',['main', 'component/models', 'jquery'], function (Constructor, models, $) {
    'use strict';

    $.fn[models.ComponentName] = function (options) {
        return Constructor.apply(Constructor, [this, options].concat(Array.prototype.splice.call(arguments, 1)));
    };

    for (var idx in models) {
        $.fn[models.ComponentName][idx] = models[idx];
    }

    return Constructor;
});
//# sourceMappingURL=jquery.js.map
;
    return require('plugin');
}));
