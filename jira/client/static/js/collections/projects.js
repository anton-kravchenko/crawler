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
                for (var i = 0; i < tasks.length; i++){

                    tasksList.push(tasks[i]);
                }
            });

            return tasksList;
		},
		getModelById: function(task_id, project_id){
			var allTasks = this.getAllTasks();
			return allTasks.filter(function(task){
				return ( (task._id == task_id) &&  (task.project_id == project_id))
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
