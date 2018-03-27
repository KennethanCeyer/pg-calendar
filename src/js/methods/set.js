define([
  'jquery',
  'moment',
  '../manager/index',
  '../component/models'
], ($,
    moment,
    DateManager,
    models) => {
  return function (date) {
    if (date) {
      const dateSplit = date.split('~').map(element => {
        const format = $.trim(element);
        return !format ? null : format;
      });

      this.each(function () {
        const $this = $(this);
        const local = $this[0][models.name];
        const context = local.context;

        const dateArray = [
          !dateSplit[0] ? null : moment(dateSplit[0], context.settings.format),
          !dateSplit[1] ? null : moment(dateSplit[1], context.settings.format)
        ];
        local.dateManager = new DateManager(dateArray[0]);

        if (context.settings.pickWeeks === true) {
          if (dateArray[0]) {
            const date = dateArray[0];
            dateArray[0] = date.clone().startOf('week');
            dateArray[1] = date.clone().endOf('week');
          }
        }

        if (context.settings.toggle === true) {
          local.storage.activeDates = dateSplit;
        }
        else {
          local.current = dateArray;
        }
        local.renderer.call();
      });
    }
  };
});