define([
	'jquery',
	'underscore',
	'backbone',
	'API',
	'tasksCollection'
], function ($, _, Backbone, API, TasksCollection) {

	var ProjectModel = Backbone.Model.extend({
		defaults : {
			_id : '',
            postedBy : '',
			name : '',
			tasks : new TasksCollection()
		},
		updateProject : function(callback, errorCallback){
			var data = this.attributes;
			API.updateProject(this.get('_id'), data, callback, errorCallback);
		},
		createProject: function(callback, errorCallback){
			var data = this.attributes;
			delete data['_id'];

			API.createProject(data, callback, errorCallback);
		}
	});

	return ProjectModel;
});