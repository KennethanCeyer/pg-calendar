define([
    '../component/helper',
    'jquery'
], (
    helper,
    $
) => function(day) {
    this.each((_, element) => {
        const local = element.local;
        const dateManager = local.dateManager;
        const date = helper.format('{0}-{1}-{2}', dateManager.year, dateManager.month, day);
        $(element)
            .find(`.${helper.getSubClass('unit')}[data-date="${date}"]`)
            .triggerHandler('click');
    });
});
