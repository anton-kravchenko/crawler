define([
  'jquery',
  'underscore',
  'backbone',
  'backboneModal',
  'templatesHandler',
  'API',
  'projectModel'
], function ($, _, Backbone, BackboneModal, TemplatesHandler, API, ProjectModel) {

    var Modal = Backbone.Modal.extend({
      	
        template: _.template(TemplatesHandler.new_project_popup_template()),
      	viewContainer: '.my-container',
      	submitEl: '.bbm-button',
	     
      	events: {
	        'click .cancel' : 'closePopup',
	        'click .popup_close_button' : 'closePopup',
            'click .submit_new_project' : 'submitNewProject',
            'click .update_project'     : 'updateProject',
            'click .cancel_new_project' : 'closePopup'
      	},
      	closePopup : function () {
	        this.destroy();
      	},
      	cancel: function(){
        	this.destroy();
      	},
        submitNewProject: function(){
            var self = this;

            this.model.set('name', $('#project_name').val());

            this.model.createProject(function(project){
                console.log(project);
                self.closePopup();
            }, function(err){   
                console.log(err);
            });
        },
        initFormData: function(){
            $('#project_name').val(this.model.get('name'));
        },        
	    initialize: function (createNewProject, model) {
            this.createNewProject = createNewProject;

            if (createNewProject){
                this.model = new ProjectModel();
            } else {
                this.model = model;
            }
        },
        onShow: function(){
            if(!this.createNewProject) {
                $('.submit_new_project').addClass('update_project');
                $('.submit_new_project').text('Update');
                $('.submit_new_project').removeClass('submit_new_project');
                this.initFormData();
            }
        }
    });

    return Modal;
});