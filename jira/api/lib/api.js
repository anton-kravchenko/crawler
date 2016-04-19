var init_model = require('./model.js');
var validator = require('validator');
var errors = require('../lib/errors.js');
var _ = require('underscore');

var API = function(nconf, model, log){
	this.nconf = nconf;
	this.model = model;
    this.log = log;
}

function _requireAuthorization (user_id, toplevel_callback, callback) {
    if (!user_id) {
        var error_unauthorized = errors.create('auth_unauthorized', 'Unauthorized', {
            code: 401
        });
        toplevel_callback(error_unauthorized);
    } else {
        callback();
    }
}

API.prototype.login = function(username, password, callback) {
    var self = this;

    self.model.Users.findOne( {'username' : username}).populate('projects')
        .exec(function (err, user) {
            if (user && user.password == password) {
                callback(undefined, { id: user.get('id').toString()},  { user_id: user.get('id')});
            } else {
                var error = errors.create('auth_incorrect_password', 'Incorrect login/password', {
                    code: 403
                });
                console.log(error);
                callback(error);
            }
        });
};

//self.model.Users.findOne( {'username' : username}).populate('projects')
//projects : user.get('projects') },

API.prototype.register = function(username, email, password, callback) {
    var self = this;
    var errors_message = '';
    var invalid_fields_list = [];

    var pushInvalidField = function (list, field) {
        if (!_.contains(list, field)) {
            list.push(field);
        }
    };

    var updateErrorMessage = function (errors_message, new_error_message) {
        var message = '';

        if (errors_message.length > 0) {
            message = errors_message + ' ' + new_error_message + '.';
        } else {
            message = errors_message + new_error_message + '.';
        }

        return message
    };

    //Validating Username
    if (!validator.isLength(username, 1)) {
        pushInvalidField(invalid_fields_list, 'username');
        errors_message = updateErrorMessage(errors_message, 'Empty username');
    } else if (!validator.isLength(username, 4)) {
        pushInvalidField(invalid_fields_list, 'username');
        errors_message = updateErrorMessage(errors_message, 'Username is too short');
    }
    ;

    //Validating Email
    if (validator.isLength(email, 1) && !validator.isEmail(email)) {
        pushInvalidField(invalid_fields_list, 'email');
        errors_message = updateErrorMessage(errors_message, 'Invalid email');
    }

    //Validating Password
    if (!validator.isLength(password, 6)) {
        pushInvalidField(invalid_fields_list, 'password');
        errors_message = updateErrorMessage(errors_message, 'Password is too short');
    }


    //Check if have validation errors
    if (invalid_fields_list.length > 0) {
        var error = errors.create('auth_incorrect_register_data', errors_message, {
            code: 403,
            details: invalid_fields_list
        });
        console.log(error);
        callback(error);
        return;
    }

    self.model.Users.findOne({username : username}, function(err, user){
        if(user){
            var error = errors.create('auth_incorrect_register_data', 'Username already exists', {
                code: 403
            });
            callback(error);
        } else {
            self.model.Users.create({ username : username,
                                      email : email,
                                      password: password
            }, function (err, user) {
                if (err) {
                    var error = errors.create('auth_incorrect_register_data', 'User create error', {
                        code: 403
                    });
                    callback(error);
                } else {
                    callback(undefined, user);
                }
            });
        }
    });
};

API.prototype.createProject = function(user_id, name, callback) {
    var self = this;
    _requireAuthorization(user_id, callback, function () {
        self.model.Projects.create({
            postedBy: user_id,
            name: name
        }, function (err, project) {
            if (err) {
                var error = errors.create('incorrect_project_data', 'Project create error', {
                    code: 403
                });
                callback(error);
            } else {
                self.model.Users.findOne({ _id : user_id}, function (err, user){
                    if (!err){
                        user.projects.push(project._id);
                    }
                    user.save(function (err, user) {
                        if (err) {
                            var error = errors.create('incorrect_project_data', 'Project create error', {
                                code: 403
                            });
                        } else {
                            callback(undefined, project);
                        }
                    });
                });
            }
        });
    });
};

API.prototype.getAllProjects = function(user_id, callback) {
    var self = this;

    self.model.Projects.find( {'postedBy' : user_id}).populate('tasks')
        .exec(function (err, projects) {
            if (err) {
                var error = errors.create('cant_grep_projects', 'Projects grep error', {
                    code: 403
                });
                callback(error);
            } else {
                    callback(undefined, projects);
            }
        });
};

API.prototype.createTask = function(user_id, project_id, title, description, type, status, date, priority, callback) {
    var self = this;
    _requireAuthorization(user_id, callback, function () {
        self.model.Tasks.create({
            postedBy     : user_id,
            project_id   : project_id,
            title 		 : title,
            description  : description,
            type 		 : type,
            status 		 : status,
            date 		 : date,
            priority 	 : priority
        }, function (err, task) {

            if (err) {
                var error = errors.create('incorrect_task_data', 'Task create error', {
                    code: 403
                });
                callback(error);
            } else {
                self.model.Projects.findOne({'_id' : task.project_id}).exec(function (err, project) {
                    if (!err){
                        project.tasks.push(task._id);
                    }
                    project.save(function (err, project) {
                        if (err) {
                            var error = errors.create('incorrect_project_data', 'Project create error', {
                                code: 403
                            });
                        } else {
                            callback(undefined, task);
                        }
                    });
                });
            }
        });
    });
};



API.prototype.updateTask = function(user_id, _id, title, description, type, status, priority, callback) {
    var self = this;

    _requireAuthorization(user_id, callback, function(){
        self.model.Tasks.findById( _id, function (err, task) {
            if (!err && task) {
                task.title 		  = title;
                task.description  = description;
                task.type 		  = type;
                task.status       = status;
                task.priority 	  = priority

                task.save(function (err, user) {
                    if (err) {
                        var error = errors.create('incorrect_task_data', 'Update task error', {
                            code: 403
                        });
                        callback(error);
                    } else {
                       callback(undefined, task);
                    }
                });
            } else {
                var error = errors.create('cant_find_and_update_taskr', 'Update task error.', {
                    code: 403
                });
                console.log(error);
                callback(error);
            }

            
        });
    });
};

module.exports = function(nconf, log, callback){
	init_model(nconf, log, function(error, model){
		if(!error){
			var api = new API(nconf, model, log);
			callback(undefined, api);
		} else {
			callback(error);			
		}
	})
};