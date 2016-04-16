var express = require('express');
var path = require('path');
var http = require('http');

var app = express();


app.set('port', 3333);
app.use(express.static(path.join(__dirname, 'static')));

app.get('/sign_in', function(req, res){
    res.redirect('/#sign_in');
});

app.get('/customers', function(req, res){
    res.redirect('/#customers');
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});