define([
    '../component/helper'
], (
    Helper
) => {
    return {
        top: Helper.GetSubClass('Top'),
        header: Helper.GetSubClass('Header'),
        body: Helper.GetSubClass('Body'),
        button: Helper.GetSubClass('Button')
    };
});