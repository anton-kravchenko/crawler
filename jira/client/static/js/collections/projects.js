define([
	'jquery',
	'underscore',
	'backbone',
	'projectModel'
], function ($, _, Backbone, Model) {

	var ProjectsCollection = Backbone.Collection.extend({
		model: Model,
		getAllTasks : function(){
			var tasksList = [];
			
			this.each(function(project){
                var tasks = project.get('tasks');
                tasks.each(function(task){
                    tasksList.push(task);
                });
            });

            return tasksList;
		},
		getModelById: function(task_id, project_id){
			var allTasks = this.getAllTasks();
			return allTasks.filter(function(task){
				return ( (task.get('_id') == task_id) &&  (task.get('project_id') == project_id))
			});
		},
		getProjectById: function(project_id){
			return this.where({
				_id : project_id
			})
		}
	});

	var Projects = new ProjectsCollection();
	
	return Projects;
});
