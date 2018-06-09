define([], () => ({
    register: (name, install, lib) => {
        if (lib)
            return lib;

        if (!console || typeof console.error !== 'function')
            return lib;

        console.warn(`PIGNOSE Calendar needs ${name} library.
If you want to use built-in plugin, Import dist/pignose.calendar.full.js.
Type below code in your command line to install the library.`);
        console.warn(`$ ${install}`);

        return lib;
    }
}));
