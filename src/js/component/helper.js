define([
  './models'
], (models) => {
  const m_formatCache = {};
  const m_classCache = {};
  const m_subClassCache = {};
  const m_regex_upper = /[A-Z]/;

  const helper = function Constructor() {
  };

  helper.format = function (format) {
    if (!format) {
      return '';
    }
    else {
      const args = Array.prototype.slice.call(arguments, 1);
      const key = format + args.join('.');

      if (m_formatCache[key]) {
        return m_formatCache[key]
      }
      else {
        const len = args.length;
        for (let idx = 0; idx < len; idx++) {
          const value = args[idx];
          format = format.replace(new RegExp(('((?!\\\\)?\\{' + idx + '(?!\\\\)?\\})'), 'g'), value);
        }
        format = format.replace(new RegExp(('\\\\{([0-9]+)\\\\}'), 'g'), '{$1}');
      }
      m_formatCache[key] = format;
      return format;
    }
  };

  helper.getClass = name => {
    const key = [models.name, name].join('.');

    if (m_classCache[key]) {
      return m_classCache[key];
    }
    else {
      const chars = name.split('');
      const classNames = [];
      const len = chars.length;

      for (let idx = 0, pos = 0; idx < len; idx++) {
        let char = chars[idx];
        if (m_regex_upper.test(char) === true) {
          classNames[pos++] = '-';
          char = char.toString().toLowerCase();
        }
        classNames[pos++] = char;
      }

      const className = classNames.join('');
      m_classCache[key] = className;
      return className;
    }
  };

  helper.getSubClass = name => {
    if (name && name.length) {
      const names = name.split('');
      names[0] = names[0].toUpperCase();
      name = names.join('');
    }

    if (!m_subClassCache[name]) {
      m_subClassCache[name] = helper.getClass(helper.format('{0}{1}', models.name, name));
    }
    return m_subClassCache[name];
  };

  return helper;
});