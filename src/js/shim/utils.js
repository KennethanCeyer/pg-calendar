define([], () => {
  return {
    register: (name, install, lib) => {
      if (!lib) {
        const message = `PIGNOSE Calendar needs ${name} library.
If you want to use built-in plugin, Import dist/pignose.calendar.full.js.
Type below code in your command line to install the library.`;

        if (console && typeof console.error === 'function') {
          console.warn(message);
          console.warn(`$ ${install}`);
        }
      }
      return lib;
    }
  };
});