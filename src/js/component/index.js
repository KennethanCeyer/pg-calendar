define(['./models'], function (models) {
  var m_formatCache = {};
  var m_classCache = {};
  var m_subClassCache = {};
  var m_regex_upper = /[A-Z]/;

  var Helper = function Constructor() {
  };

  Helper.Format = function (format) {
    if (typeof format === 'undefined' || format === '' || arguments.length <= 1) {
      return '';
    } else {
      var args = Array.prototype.slice.call(arguments, 1);
      var key = format + args.join('.');
      if (typeof m_formatCache[key] !== 'undefined') {
        return m_formatCache[key]
      } else {
        var len = args.length;
        for (var idx = 0; idx < len; idx++) {
          var value = args[idx];
          format = format.replace(new RegExp(('((?!\\\\)?\\{' + idx + '(?!\\\\)?\\})'), 'g'), value);
        }
        format = format.replace(new RegExp(('\\\\{([0-9]+)\\\\}'), 'g'), '{$1}');
      }
    }
    m_formatCache[key] = format;
    return format;
  };

  Helper.GetClass = function (name) {
    var key = [models.ComponentName, name].join('.');
    if (typeof m_classCache[key] !== 'undefined') {
      return m_classCache[key];
    } else {
      var chars = name.split('');
      var classNames = [], className;
      var len = chars.length;
      for (var idx = 0, pos = 0; idx < len; idx++) {
        var char = chars[idx];
        if (typeof char !== 'string') {
          continue;
        }

        if (m_regex_upper.test(char) === true) {
          classNames[pos++] = '-';
          char = char.toString().toLowerCase();
        }
        classNames[pos++] = char;
      }

      className = classNames.join('');
      m_classCache[key] = className;
      return className;
    }
  };

  Helper.GetSubClass = function (name) {
    if (typeof m_subClassCache[name] === 'undefined') {
      m_subClassCache[name] = Helper.GetClass(Helper.Format('{0}{1}', models.ComponentName, name));
    }
    return m_subClassCache[name];
  };

  return Helper;
});