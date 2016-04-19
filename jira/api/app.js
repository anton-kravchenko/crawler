var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var bunyan = require('bunyan');
var nconf = require('nconf');
var cors = require('express-cors');
var cookieParser = require('cookie-parser');

var package_json = require('./package.json');

var init_api = require('./lib/api');
var Router = require('./lib/router');

nconf
    .argv()
    .env()
    .file({file: './defaults.json'});

var log = bunyan.createLogger({
   name: package_json['name'],
   streams: [
       {
           level: 'info',
           stream: process.stdout
       },
       {
           level: nconf.get('log_level'),
           type: 'rotating-file',
           path: nconf.get('log_path')
       }
   ]
});

init_api(nconf, log, function (error, api) {
	var app = express();
    var router = new Router(app, {
        target: api,
        log: log
    });

	app.on('uncaughtException', function (req, res, route, err) {
	    var a_log = req.log ? req.log : log;
	    a_log.error(err);

	    res.send(500, {
	        status: 'server_error',
	        message: err.message
	    });
	});

	app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

	app.use(session({
	    secret: nconf.get('security_session_secret'),
	    name: 'user_session',
	    rolling: true,
	    resave: false,
	    saveUninitialized: false,
	    cookie: {
	        maxAge: 12 * 24 * 60 * 60 * 1000
	    }
	}));

	app.use(cors({
	    allowedOrigins: [
	        nconf.get('frontend_host'), nconf.get('backend_host')
	    ]
	}));

	app.use(function (req, res, next) {
	    res.setHeader('Access-Control-Allow-Origin', nconf.get('frontend_host'));
	    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	    res.setHeader('Access-Control-Allow-Credentials', true);
	    next();
	});

    router.post('/login', {
        parameters: {
            username: router.String,
            password: router.String
        },
        call: [api.login, 'username', 'password']
    });

    router.post('/register', {
        parameters: {
            username: router.String,
            email: router.String,
            password: router.String
        },
        call: [api.register, 'username', 'email', 'password']
    });

    router.post('/add_project', {
        parameters: {
            name: 	 	 router.String,
        },
        call: [ api.createProject, 'session:user_id', 'name']
    });

    router.post('/add_task', {
        parameters: {
            project_id   : router.String,
            title 		 : router.String,
            description  : router.String,
            type 		 : router.String,
            status 		 : router.String,
            date 		 : router.String,
            priority 	 : router.String
        },
        call: [ api.createTask, 'session:user_id',
                                'project_id',
                                'title',
                                'description',
                                'type',
                                'status',
                                'date',
                                'priority']
    });

    router.get('/get_projects', {
        parameters: {
        },
        call: [ api.getAllProjects, 'session:user_id']
    });

    router.post('/update_task/', {
        parameters: {
            _id  : router.String,
            title    : router.String,
            description : router.String,
            type     : router.String,
            status   : router.String,
            priority : router.String
        },
        call: [ api.updateTask, 'session:user_id',
                                '_id',
                                'title',
                                'description',
                                'type',
                                'status',
                                'priority']
    });


	app.listen(nconf.get('port'), function () {
	    console.log('Listening %s at %d', package_json['name'], nconf.get('port'));
	});
});