define([
    './shim/utils'
], (
    Utils
) => {
    let lib;
    try {
        lib = jQuery || $;
    }
    catch(e) { ; }
    return Utils.register('jquery', 'npm install jquery --save', lib);
});