define([
    './methods/index',
    './component/models',
    './component/polyfills',
], (
    Methods,
    Models,
    Polyfills
) => {
    'use strict';
    window[Models.ComponentName] = {
        VERSION: Models.ComponentVersion
    };

    const Component = Methods;
    return Component;
});
