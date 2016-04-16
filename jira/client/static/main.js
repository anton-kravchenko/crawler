var libsPath = './lib/';

require.config({
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    },
    backbone_modal: {
      deps : [
        'Backbone'
      ],
      exports : 'BackboneModal'
    },
    bootstrap: {
      deps : [
        'jquery'
      ],
      exports : 'bootstrap'
    },
  },
  waitSeconds: 200,
  paths: {
    text:          libsPath + 'text',
    jquery:        libsPath + 'jquery',
    underscore:    libsPath + 'underscore',
    backbone:      libsPath + 'backbone',
    backboneModal: libsPath + 'backbone.modal-min',
    bootstrap:     libsPath + 'bootstrap',

    templatesHandler : './templates/templatesHandler',
    config : './config/config',
    
    appView : './js/views/app',
    landingView : './js/views/landingView',
    mainView : './js/views/mainView',

    newProjectPopup : './js/views/newProjectPopup',
    newTaskPopup : './js/views/newTaskPopup',
    
    taskModel : './js/models/taskModel',
    projectModel : './js/models/projectModel',

    projecstCollection : './js/collections/projects',
    tasksCollection : './js/collections/tasks',

    API : './js/api/API',
    router: './js/router/router',
  
  }
});

require([
  'bootstrap',
  'backbone',
  'appView',
  'router',
  'config'
], function (Backbone, AppView, Router, config) {
    config.initialize(function(){
      new AppView().render();
    });
});