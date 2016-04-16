define([
	'jquery',
	'backbone',
], function ($, Backbone) {

	var AppRouter = Backbone.Router.extend({
	
		routes: {
			""     	  : "showSignIn",
			"sign_in" : "showSignIn",
			"customers"	  : "showCustomers",
		},
		destroyCurrentView: function(){
			if(this.currentView){
				this.currentView.close();
			}
		},

		showSignIn: function () {
			this.destroyCurrentView();

			var self = this;
			require(['landingView'], function(View){
				self.currentView = new View();
				self.currentView.render('index');
			});
			
		},
        
		showCustomers: function(){
			this.destroyCurrentView();

			var self = this;
			require(['mainView'], function(View){
				self.currentView = new View();
				self.currentView.render();
			});	
			
		}
	});

  	Backbone.View.prototype.close = function () {
    	this.undelegateEvents();
    	this.unbind();
  	};

	app = new AppRouter();
	Backbone.history.start();
});