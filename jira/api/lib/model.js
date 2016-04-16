var mongoose = require('mongoose'),
	mongodbUri = require('mongodb-uri'),
	//autoIncrement = require('mongoose-auto-increment'),
	model = {};

module.exports = function(nconf, log, callback){
	var mongo_log = log.child({
		component : 'mongo'
	});

	var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };
                
	var uri = mongodbUri.format(
        {
        	username : nconf.get('mongo_db_username'),
        	password : nconf.get('mongo_db_password'),
            hosts: [
                {
                    host: nconf.get('mongo_db_host'),
                    port: nconf.get('mongo_db_port')
                }
            ],
            database: nconf.get('mongo_db_db_name'),
        }
	);

	var connection = mongoose.connect(uri, options);
	var db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function () {
		mongo_log.info('Open ' + nconf.get('mongo_db_db_name') + ' connection.');

		var Schema = mongoose.Schema;

	  	var userSchema = new Schema({
	  		username : String,
	  		password : String,
	  		salt	 : String,

	  		projects : [{
                type: Schema.Types.ObjectId,
                ref: 'Project'
            }]
	  	});

		var projectSchema = new Schema({
			postedBy : {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
			name 	 : String,
			tasks : [{
                type: Schema.Types.ObjectId,
                ref: 'Task'
            }]
		});

		var taskSchema = new Schema({
			postedBy     : { type: Schema.Types.ObjectId, ref: 'User' },
			project_id   : { type: Schema.Types.ObjectId, ref: 'Project' },
			title 		 : String,
			description  : String,
			type 		 : String,
			status 		 : String,
			date 		 : String,
			priority 	 : String
		});


		model.Users = mongoose.model('User', userSchema);
        model.Projects= mongoose.model('Project', projectSchema);
        model.Tasks= mongoose.model('Task', taskSchema);

        callback(undefined, model);
    }
)};
