define([
		'main',
		'component/models',
		'jquery'
], function(Constructor, models, $) {
	'use strict';
	$.fn[models.ComponentName] = function(options) {
		Constructor(this, options);
	};

	for (var idx in models) {
		$.fn[models.ComponentName][idx] = models[idx];
	}

	return Constructor;
});