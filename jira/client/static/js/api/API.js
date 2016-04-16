define(['jquery', 'config'], function ($, config) {

	
	var API = {

		entry_point  : 'http://localhost:3110',
		// entry_point  : config.get('entryPoint'),
		frontEndhost : 'http://localhost:333', 
		// frontEndhost : config.get('frontEndHost'), 

		minimumPasswordLength : 5,
		minimumUsernameLength : 5,
		
		login : function(userData, callback, errorCallback){
			var url = this.entry_point  + '/login'
			
			var loginData = {
				username : userData.username,
				password : userData.password
			}

			sendXHR(url, 'post', loginData, callback, errorCallback);
		},	
        
		register : function(userData, callback, errorCallback){
			var url = this.entry_point + '/register';

			var registerData = {
				username : userData.username,
				email : userData.email,
				password : userData.password
			}

			sendXHR(url, 'post', registerData, callback, errorCallback);
		},

		createProject : function(data, callback, errorCallback){
			var url = this.entry_point + '/add_project';
			sendXHR(url, 'post', data, callback, errorCallback);
		},

		createTask : function(data, callback, errorCallback){
			var url = this.entry_point + '/add_task';
			sendXHR(url, 'post', data, callback, errorCallback);
		},

		getProjects : function(callback, errorCallback){
			var url = this.entry_point + '/get_projects';
			sendXHR(url, 'get', null, callback, errorCallback);
		},

		updateCustomer : function(customer_id, data, callback, errorCallback){
			var url = this.entry_point + '/update_customer/' + customer_id;
			sendXHR(url, 'post', data, callback, errorCallback);
		},

		deleteCustomer : function(customer_id, callback, errorCallback){
			var url = this.entry_point + '/delete_customer/' + customer_id;
			sendXHR(url, 'delete', null, callback, errorCallback);
		}
	}

	function sendXHR (url, requestType, data, callback, errorCallback){
		var rType = requestType.toUpperCase();

		var xhr = $.ajax({
            type: rType,
            data: data,
            url: url, 
        	xhrFields: {
              	withCredentials: true
            },
			crossDomain: true,
            success: function(response, status, request) { 
            	console.log(JSON.stringify(response));
        		if(callback){
	         	 	callback(response);
         	 	}
            },
            error: function(response) {
            	console.log('ERROR ' + JSON.parse(response.responseText).message);
            	if(errorCallback){
            		var error = JSON.parse(response.responseText).message;
        			errorCallback(error);
        		}
                if('Unauthorized' == JSON.parse(response.responseText).message){
	    	    	app.navigate('sign_in', {trigger: true});
    		    }
            }
        });
              
	}

	return API;
});