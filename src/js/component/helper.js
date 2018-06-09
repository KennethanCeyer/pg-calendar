define([
    './models'
], models => {
    const formatCache = {};
    const classCache = {};
    const subClassCache = {};
    const regexUpper = /[A-Z]/;

    return class Helper {
        constructor() { }

        static format(template, ...args) {
            if (!template)
                return '';

            const key = `${template}${args.join('.')}`;

            if (formatCache[key])
                return formatCache[key];

            args.forEach((value, idx) =>
                template = template.replace(new RegExp((`((?!\\\\)?\\{${idx}(?!\\\\)?\\})`), 'g'), value));
            template = template.replace(new RegExp(('\\\\{([0-9]+)\\\\}'), 'g'), '{$1}');
            formatCache[key] = template;

            return template;
        }

        static getClass(name) {
            const key = [models.name, name].join('.');

            if (classCache[key])
                return classCache[key];

            const chars = name.split('');
            const classNames = [];

            for (let idx = 0, pos = 0; idx < chars.length; idx++) {
                let char = chars[idx];
                if (regexUpper.test(char)) {
                    classNames[pos++] = '-';
                    char = String(char).toLowerCase();
                }
                classNames[pos++] = char;
            }

            const className = classNames.join('');
            classCache[key] = className;

            return className;
        }

        static getSubClass(name) {
            const nameSplit = name && name.length
                ? name.split('')
                : [];

            if (nameSplit[0])
                nameSplit[0] = nameSplit[0].toUpperCase();

            const nameJoined = nameSplit.join('');

            if (!subClassCache[nameJoined])
                subClassCache[nameJoined] = Helper.getClass(`${models.name}${nameJoined}`);

            return subClassCache[nameJoined];
        }
    }
});
