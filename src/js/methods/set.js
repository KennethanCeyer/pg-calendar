define([
    'jquery',
    'moment',
    '../manager/index',
    '../component/models'
], (
    $,
    moment,
    DateManager,
    models
) => function(date) {
    if (!date)
        return;

    const dateSplit = date.split('~').map(element => !$.trim(element)
        ? null
        : $.trim(element)
    );

    this.each((_, element) => {
        const local = $(element)[0][models.name];
        const context = local.context;

        const dateArray = [
            !dateSplit[0] ? null : moment(dateSplit[0], context.settings.format),
            !dateSplit[1] ? null : moment(dateSplit[1], context.settings.format)
        ];
        local.dateManager = new DateManager(dateArray[0]);

        if (context.settings.pickWeeks) {
            if (dateArray[0]) {
                const date = dateArray[0];
                dateArray[0] = date.clone().startOf('week');
                dateArray[1] = date.clone().endOf('week');
            }
        }

        if (context.settings.toggle)
            local.storage.activeDates = dateSplit;
        else
            local.current = dateArray;
        local.renderer.call();
    });
});
