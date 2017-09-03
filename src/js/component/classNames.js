define([
    '../component/helper'
], (
    Helper
) => {
    return {
        top: Helper.GetSubClass('top'),
        header: Helper.GetSubClass('header'),
        body: Helper.GetSubClass('body'),
        button: Helper.GetSubClass('button')
    };
});