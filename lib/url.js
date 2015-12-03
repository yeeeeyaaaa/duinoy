var events = require('events'),
    child  = require('child_process'),
    util   = require('util'),
    chalk  = require('chalk');
    

var Url = function (options) {
	this.log('info', 'initializing');
  this.debug = options && options.debug || false;
  this.host = options || 'http://192.168.1.51';
  this.port = option || '8080'
  this.pin = options || '1';
  this.call = options || 'analog';
}

/*
 * EventEmitter, I choose you!
 */
util.inherits(Url, events.EventEmitter);


Url.prototype.connect = function(){
	this.log('info', 'attempting to find Arduino Wifi board');
  var self = this;
	var http = require('http');

//The url we want is `www.nodejitsu.com:1337/`
var options = {
  host: self.host,
  path: '/' + self.call + '/' + self.pin,
  //since we are listening on a custom port, we need to specify it by hand
  port: self.port,
  //This is what changes the request to a POST request
  method: 'GET'
};

callback = function(response) {
  var str = ''
  self.emit('connected');
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    //console.log(str);
    self.log('receive', chalk.green(str));
  });
}

var req = http.get(options, callback);
req.on('error', function(err) {
    //res.send('error: ' + err.message);
    msg = "Could not establish HTTP connection to Arduino.";
    self.log('error', chalk.red(msg));
    if (self.listeners('error').length > 0) {
      self.emit('error', msg);
    } else {
      throw new Error(msg);
    }
});
//This is the data we are posting, it needs to be a string or a buffer
//req.write("hello world!");
//req.end();
var err = null;
self.emit('data', str);
this.emit('read', err, str);
self.emit('ready');
return str;
}

/*
 * Logger utility function
 */
Board.prototype.log = function (/*level, message*/) {
  var args = [].slice.call(arguments);
  if (this.debug) {
    console.log(chalk.gray(Date.now()) + chalk.blue(' duino ') + chalk.magenta(args.shift()) + ' ' + args.join(', '));
  }
}

module.exports = Url;