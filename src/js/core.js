define([
    './methods/index',
    './component/models'
], (
    methods,
    models
) => {
    'use strict';

    window[models.name] = {
        version: models.version
    };

    const Component = methods;
    return Component;
});
