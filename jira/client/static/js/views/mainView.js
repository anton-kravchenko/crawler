define([
	'jquery', 
	'underscore',
	'backbone',
    'templatesHandler',
    'API',
    'newProjectPopup',
    'newTaskPopup',
    'projecstCollection',
    'projectModel',
    'taskModel'
], function ($, _, Backbone, TemplateHandler, API, NewProjectPopup, NewTaskPopup, ProjecstCollection, ProjectModel, TaskModel) {

    var LandingScreen = Backbone.View.extend({

		el: '#app',

		signInUpcontainer : '.signInUpContainer',

        header_template : TemplateHandler.header_template,

		main_view_template : TemplateHandler.main_view_template,

        issue_item_template : TemplateHandler.issue_item_template,

        noteTemplate : TemplateHandler.customer_template,

		events: {
            'click .submit_new_note': 'submitCustomer',
            'click .cancel_new_note': 'cancelNewCustomer',
            'click .add_new_customer' : 'showCreateTaskPopup'
		},
        
		maxNoteLength :  255,

		initialize: function () {
            this.projects = ProjecstCollection;
		},
        showCreateTaskPopup: function(model){
            this.popup = new NewTaskPopup(true, this.customers, null);
            $('#app').append(this.popup.render().el);
        },
        showEditTaskPopup: function(model){
            this.popup = new NewTaskPopup(false, model);
            $('#app').append(this.popup.render().el);  
        },
        parseTasksArray: function(projectsData,  newCustomers){
            var self = this;

            for (var i=0; i < projectsData.length; i++){
            
                var project = projectsData[i];
                var projectName = projectsData[i].name;

                for (var j=0; j < project.tasks.length; j++){
                    project.tasks[j].task_id = projectName + ' - ' + (j + 1);
                }

                this.projects.add(project);
            }

            this.fillIssuesContainer();

            // for(i in projects){

            //     $('.customers_container').append(TemplateHandler.customer_template(this.customers.at(i).toJSON()));

            //     (function(customerEl, model){
            //         $(customerEl).find('.update_customer').on('click', function(){
            //             self.showEditCustPopup(model, self.customers);
            //         });
            //         $(customerEl).find('.delete_customer').on('click', function(){

            //              API.deleteCustomer(model.get('_id'), function(response){
            //                     $(customerEl).fadeOut(function(){
            //                         $(customerEl).remove();
            //                     })
            //                 },
            //                 function(error){
            //                     $(note_text_el).parent().find('.updating_spinner').css('display', 'none');
            //                 }
            //             );
            //         });

            //     })($('.customer_container').last(), this.customers.at(i));

            // }
        },
        fillIssuesContainer: function(){
            var tasksList = this.projects.getAllTasks();
            var self = this;

            for (var i=0; i < tasksList.length; i++){
                $('.issues_container').append(this.issue_item_template({
                    task_id : tasksList[i].task_id,
                    title : tasksList[i].title
                }));

                (function(id, project_id){
                    $('.issue_item').last().on('click', function(){
                        var modelData = self.projects.getModelById(id, project_id);
                        if(modelData.length > 0){
                            var taskModel = new TaskModel(modelData[0]);
                            self.showEditTaskPopup(taskModel);
                        }
                    });
                })(tasksList[i]._id, tasksList[i].project_id);
            }

            // var musketeers = friends.where({job: "Musketeer"});
            // var notMusketeers = friends.filter(function (friend) {
            //   return friend.job !== 'Musketeer';
            // });
        },
		render: function () {
            var self = this;
            $(this.el).html(this.header_template());
            $(this.el).append(this.main_view_template());

            API.getProjects(function(data){
                self.parseTasksArray(data);
            });
            // $('.customers_container').on('updateView', function(){
            //     $('.customer_container').remove();
            //     self.parseTasksArray(self.customers.toJSON(), false);
            // })
		},

	});

	return LandingScreen;

});