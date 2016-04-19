define([
	'jquery', 
	'underscore',
	'backbone',
    'templatesHandler',
    'API',
    'newProjectPopup',
    'newTaskPopup',
    'projecstCollection',
    'tasksCollection',
    'projectModel',
    'taskModel'
], function ($, _, Backbone, TemplateHandler, API, NewProjectPopup, NewTaskPopup, ProjecstCollection, TasksCollection, ProjectModel, TaskModel) {

    var LandingScreen = Backbone.View.extend({

		el: '#app',

        detailedIssueContainer : '.issue_detailed_container',

		signInUpcontainer : '.signInUpContainer',

        header_template : TemplateHandler.header_template,

		main_view_template : TemplateHandler.main_view_template,

        issue_item_template : TemplateHandler.issue_item_template,

        detailed_issue_view_template : TemplateHandler.detailed_issue_view_template,

        projects_dropdown_item : TemplateHandler.projects_dropdown_item,

		events: {
            'click .submit_new_note': 'submitCustomer',
            'click .cancel_new_note': 'cancelNewCustomer',
            'click .add_new_customer' : 'showCreateTaskPopup'
		},
        
		maxTitleLength : 40,

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
                var tasks = new TasksCollection();

                for (var j=0; j < project.tasks.length; j++){
                    project.tasks[j].task_id = projectName + ' - ' + (j + 1);
                    tasks.add(new TaskModel(project.tasks[j]));
                }

                project.tasks = tasks;
                this.projects.add(project);
            }

            this.fillIssuesContainer();
            this.initializeProjectSelectControl();
        },
        initializeProjectSelectControl:function(){
            var self = this;

            this.projects.each(function(item){
                $('.projects_dropdown').append(self.projects_dropdown_item({
                    name : item.get('name'),
                    id : item.get('_id')
                }));
            });

            $('.project_item').on('click', function(e){
                $('.project_item').removeClass('active');
                $(this).addClass('active');

                self.filterIssuesByProject($(this).attr('project_id'));
            });
        },
        filterIssuesByProject: function(project_id){
            if(!project_id) {
                $('.issue_item').show();
                return;
            }

            $( ".issue_item[project_id!='" + project_id + "']" ).hide();
            $( ".issue_item[project_id='" + project_id + "']" ).show();
        },
        showDetailedView: function(model){
            var self = this;
            $(this.detailedIssueContainer).html(this.detailed_issue_view_template({
                task_id     : model.get('task_id'),
                title       : model.get('title'),
                description : model.get('description'),
                type        : model.get('type'),
                priority    : model.get('priority').toLowerCase(),
                status      : model.get('status')
            }));

            $('#update_issue').off('click');
            $('#update_issue').on('click', function(e){
                self.showEditTaskPopup(model);
            });

        },
        fillIssuesContainer: function(){
            var tasksList = this.projects.getAllTasks();
            var self = this;

            for (var i=0; i < tasksList.length; i++){
                var title = tasksList[i].get('title');
                if (this.maxTitleLength < title.length){
                    title = title.substr(0, this.maxTitleLength -3);
                    title += '...'
                }
                $('.issues_container').append(this.issue_item_template({
                    task_id : tasksList[i].get('task_id'),
                    title : title,
                    priority : tasksList[i].get('priority').toLowerCase(),
                    project_id : tasksList[i].get('project_id')
                }));

                (function(id, project_id){
                    $('.issue_item').last().on('click', function(){
                        var modelData = self.projects.getModelById(id, project_id);
                        self.showDetailedView(modelData[0]);
                    });
                })(tasksList[i].get('_id'), tasksList[i].get('project_id'));
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