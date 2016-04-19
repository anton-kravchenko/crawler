define([
	'jquery',
	'underscore',
	'backbone',
	'API',
], function ($, _, Backbone, API) {

	var TaskModel = Backbone.Model.extend({
		defaults : {
			_id : '',
			task_id		 : '',
            postedBy     : '',
			project_id   : '',
			title 		 : '',
			description  : '',
			type 		 : '',
			status 		 : '',
			date 		 : '',
			priority 	 : ''

		},
		updateTask : function(callback, errorCallback){
			var data = this.attributes;
			API.updateTask(data, callback, errorCallback);
		},
		createTask: function(callback, errorCallback){
			this.set('date', new Date().toString());
			
			var data = this.attributes;
			delete data._id;
			delete data.postedBy;

			API.createTask(data, callback, errorCallback);
		}
	});

	return TaskModel;
});