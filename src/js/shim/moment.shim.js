define([
    './shim/utils'
], (
    Utils
) => {
    let lib;
    try {
        lib = moment;
    }
    catch(e) { ; }
    return Utils.register('moment', 'npm install moment --save', lib);
});