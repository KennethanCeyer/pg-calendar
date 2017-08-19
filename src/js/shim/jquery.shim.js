define([], () => {
    const lib = jquery || $;
    const message = 'PIGNOSE Calendar plugin must be needed jQuery library.\n' +
                    'If you want to use built-in plugin, Import `dist/pignose.calendar.full.js`.'

    if (!lib) {
        if (console && typeof console.error === 'function') {
            console.error(message);
        }
    }

    return lib;
});