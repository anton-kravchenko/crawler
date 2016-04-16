define([
	'jquery',
	'underscore',
	'backbone',
	'taskModel'
], function ($, _, Backbone, Model) {

	var TasksCollection = Backbone.Collection.extend({
		model: Model
	});

	return TasksCollection;
});
