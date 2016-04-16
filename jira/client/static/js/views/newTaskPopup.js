define([
  'jquery',
  'underscore',
  'backbone',
  'backboneModal',
  'templatesHandler',
  'API',
  'taskModel',
  'projecstCollection'
], function ($, _, Backbone, BackboneModal, TemplatesHandler, API, TaskModel, ProjecstCollection) {

    var Modal = Backbone.Modal.extend({
        
        template: _.template(TemplatesHandler.new_task_template()),
        viewContainer: '.my-container',
        submitEl: '.bbm-button',
         
        events: {
            'click .cancel' : 'closePopup',
            'click .popup_close_button' : 'closePopup',
            'click .submit_new_task' : 'submitNewTask',
            'click .update_task' : 'updateTask',
            'click .cancel_new_task' : 'closePopup',
        },
        closePopup : function () {
            this.destroy();
        },
        cancel: function(){
            this.destroy();
        },

        submitNewTask: function(){
            var self = this;
            this.model.createTask(function(task){
                console.log(task);
                self.closePopup();
            }, function(err){   
                console.log(err);
            });
        },
        updateTask: function(){
            var self = this;
            this.grepData();
            this.model.updateTask(function(task){
                console.log(task);
                self.closePopup();
            }, function(err){   
                console.log(err);
            });
            // $('.customers_container').trigger('updateView');
        },
        initFormData: function(){
            // $('#firstName').val(this.model.get('firstName'));
            // $('#lastName').val(this.model.get('lastName'));
            // $('#companyName').val(this.model.get('companyName'));
            // $('#skype').val(this.model.get('skype'));


        },
        grepData: function(){
            this.model.set({    
                firstName:    $('#firstName').val(),
                lastName:     $('#lastName').val(),
                dateOfBirth:  $('#dateOfBirth').val(),
                companyName:  $('#companyName').val(),
                skype:        $('#skype').val()
            });
        },
        initialize: function (createNewtask, model) {
            this.projects = ProjecstCollection;
            this.createNewtask = createNewtask;

            if(this.createNewtask){
                this.model = new TaskModel();
            } else {
                this.model = model;
            }
        },
        initInputs: function(){
            var self = this;
            this.initHeader();    
            this.initProjectSelector();
            this.initTitleDescription();
            this.initPrioritySelector();
            this.initTypeSelector();
            this.initStatusSelector();
            
        },
        initHeader: function(){
            if (!this.createNewtask){
                $('.popup_header').text(this.model.get('task_id'));
            }
        },
        initTitleDescription: function(){
            var self = this;
            
            $('#description').val(this.model.get('description'));
            $('#description').change(function(){
                self.model.set('description', $(this).val().trim());
            });

            $('#title').val(this.model.get('title'));
            $('#title').change(function(){
                self.model.set('title', $(this).val().trim());       
            });
        },
        initProjectSelector: function(){
            var self = this;

            this.projects.each(function(project){
                var itemString = '<li>' + project.get('name') + '</li>';
                $('.project_select').append(itemString);

                (function(project_id){
                    $('.project_select>li').last().on('click', function(event){
                        self.model.set('project_id', project_id);
                        $('.project_select>li').removeClass('active');
                        $(this).addClass('active');
                        $(this).parent().parent().find('button').text($(this).text());
                    });                  
                })(project.get('_id'))
            });

            if(!this.createNewtask){
                var projectId = this.model.get('project_id');
                try{
                    var projectName = this.projects.getProjectById(projectId)[0].get('name')
                    var items = $('.project_select>li');
                    var index = 0;
                    for (i in items){
                        index++;
                        if(projectName == $(items[i]).text()){
                            $('.project_select>li:nth-child(' + index + ')').addClass('active');
                            $('.project_select').parent().parent().find('button').text(projectName);
                            break;
                        }
                    }
                } catch(e){}
            }
        },
        initPrioritySelector: function(){
            var self = this;
            var priority = this.model.get('priority');
            var priorityString = '';
            var priorityItems = $('.priority_select>li');

            for (var i=0; i < priorityItems.length; i++){
                $(priorityItems[i]).on('click', function(){
                    self.model.set('priority', $(this).text().trim());
                    $('.priority_select>li').removeClass('active');
                    $(this).addClass('active');
                    $(this).parent().parent().find('button').text($(this).text().trim());    
                });
            }
            if(!this.createNewtask){
                var index = -1;
                if(-1 != priority.indexOf('Low')){
                    index = 1; priorityString = 'Low' ;
                }
                if(-1 != priority.indexOf('Normal')){
                    index = 2; priorityString = 'Normal' ;
                }
                if(-1 != priority.indexOf('Important')){
                    index = 3; priorityString = 'Important' ;
                }
                if(-1 != priority.indexOf('Critical')){
                    index = 4; priorityString = 'Critical' ;
                }
                
                if(-1 != index){
                    $('.priority_select>li:nth-child(' + index + ')').addClass('active');
                    $('.priority_select>li').parent().parent().find('button').text(priorityString);
                }
            }
        },
        initTypeSelector: function(){
            var self = this;
            var type = this.model.get('type')
            var typeItems = $('.type_select>li');

            for (var i=0; i < typeItems.length; i++){
                $(typeItems[i]).on('click', function(){
                    self.model.set('type', $(this).text().trim());
                    $('.type_select>li').removeClass('active');
                    $(this).addClass('active');
                    $(this).parent().parent().find('button').text($(this).text().trim());    
                });
            }

            if(-1 != type.indexOf('Feature')){
                $('.type_select>li').first().addClass('active');
                $('.type_select>li').parent().parent().find('button').text('Feature');
            } else if(-1 != type.indexOf('Bug')){
                $('.type_select>li').parent().parent().find('button').text('Bug');
                $('.type_select>li').last().addClass('active');
            }
        },
        initStatusSelector: function(){
            var self = this;
            var status = this.model.get('status');
            var statusItems = $('.status_selectors>li');
            for (var i=0; i < statusItems.length; i++){
                $(statusItems[i]).on('click', function(){
                    self.model.set('status', $(this).text().trim());
                    $('.status_selectors>li').removeClass('active');
                    $(this).addClass('active');    
                    $(this).parent().parent().find('button').text($(this).text().trim());    
                });
            }

            if(-1 != status.indexOf('Open')){
                $('.status_selectors>li').first().addClass('active');
                $('.status_selectors>li').parent().parent().find('button').text('Open');
            } else if(-1 != status.indexOf('Closed')){
                $('.status_selectors>li').parent().parent().find('button').text('Closed');
                $('.status_selectors>li').last().addClass('active');
            }
        },
        onShow: function(){
            if(!this.createNewtask) {
                $('.submit_new_customer').addClass('update_customer');
                $('.submit_new_customer').text('Update');
                $('.submit_new_customer').removeClass('submit_new_customer');
                this.initFormData();
            }
            this.initInputs();
        }
    });

    return Modal;
});