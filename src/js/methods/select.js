define([
  '../component/helper',
  'jquery'
], (helper,
    $) => {
  return function (day) {
    this.each(function () {
      const local = this.local;
      const dateManager = local.dateManager;
      const date = helper.format('{0}-{1}-{2}', dateManager.year, dateManager.month, day);
      $(this).find(helper.format('.{0}[data-date="{1}"]', helper.getSubClass('unit'), date)).triggerHandler('click');
    });
  };
});