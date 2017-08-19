define([
    './init',
    './configure',
    './setting',
    './select',
    './set',
], (
    MethodInit,
    MethodConfigure,
    MethodSetting,
    MethodSelect,
    MethodSet
) => {
    return {
        init: MethodInit,
        configure: MethodConfigure,
        setting: MethodSetting,
        select: MethodSelect,
        set: MethodSet
    };
});