define([
  '../component/helper'
], (helper) => {
  return {
    top: helper.getSubClass('top'),
    header: helper.getSubClass('header'),
    body: helper.getSubClass('body'),
    button: helper.getSubClass('button')
  };
});