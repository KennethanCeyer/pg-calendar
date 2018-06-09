define([
    './init',
    './configure',
    './setting',
    './select',
    './set',
], (
    methodInit,
    methodConfigure,
    methodSetting,
    methodSelect,
    methodSet
) => ({
    init: methodInit,
    configure: methodConfigure,
    setting: methodSetting,
    select: methodSelect,
    set: methodSet
}));
