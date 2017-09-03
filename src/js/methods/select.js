define([
    '../component/helper',
    'jquery',
    'moment'
], (
    Helper,
    $,
    moment
) => {
    return function (day) {
        this.each(function () {
            const local = this.local;
            const dateManager = local.dateManager;
            const date = Helper.Format('{0}-{1}-{2}', dateManager.year, dateManager.month, day);
            $(this).find(Helper.Format('.{0}[data-date="{1}"]', Helper.GetSubClass('unit'), date)).triggerHandler('click');
        });
    };
});