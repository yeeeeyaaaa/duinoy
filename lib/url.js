var events = require('events'),
    child  = require('child_process'),
    util   = require('util'),
    chalk  = require('chalk');
    

var Url = function (options) {
	this.log('info', 'initializing');
  this.debug = options && options.debug || false;
  this.host = options || 'http://192.168.1.51';
  this.port = options || '8080'
  this.pin = options || '1';
  this.call = options || 'analog';
}

/*
 * EventEmitter, I choose you!
 */
util.inherits(Url, events.EventEmitter);


Url.prototype.connect = function(callback){
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
  
  http.get(options, function(res) {
    var body = '';
    res.on('data', function(chunk) {
      self.emit('connected');
      body += chunk;
    });
    res.on('end', function() {
      console.log(body);
      self.emit('data', body);
      var err = null;
      self.emit('read', err, body);
      self.emit('ready');
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    var msg = "Could not establish HTTP connection to Arduino.";
    if (self.listeners('error').length > 0) {
      self.emit('error', msg);
    } else {
      throw new Error(msg);
    }
  }); 
  
  // callback = function(response) {
  //   var str = ''
  //   self.emit('connected');
  //   response.on('data', function (chunk) {
  //     str += chunk;
  //   });
  
  //   response.on('end', function () {
  //     //console.log(str);
  //     self.log('receive', chalk.green(str));
  //     self.emit('data', str);
  //     var err = null;
  //     this.emit('read', err, str);
  //     self.emit('ready');
  //   });
  // }
      
  // var req = http.get(options, callback);
  // req.on('error', function(err) {
  //     //res.send('error: ' + err.message);
  //     var msg = "Could not establish HTTP connection to Arduino.";
  //     self.log('error', chalk.red(msg));
  //     if (self.listeners('error').length > 0) {
  //       self.emit('error', msg);
  //     } else {
  //       throw new Error(msg);
  //     }
  // });
  
  
  // return http.get({
  //       host: 'personatestuser.org',
  //       path: '/email'
  //   }, function(response) {
  //       self.emit('connected');
    
  //       // Continuously update stream with data
  //       var body = '';
  //       response.on('data', function(d) {
  //           body += d;
  //       });
  //       response.on('end', function() {

  //           // Data reception is done, do whatever with it!
  //           var parsed = JSON.parse(body);
  //           callback({
  //               email: parsed.email,
  //               password: parsed.pass
  //           });
  //       });
  //   });

  
}

/*
 * Logger utility function
 */
Url.prototype.log = function (/*level, message*/) {
  var args = [].slice.call(arguments);
  if (this.debug) {
    console.log(chalk.gray(Date.now()) + chalk.blue(' duino ') + chalk.magenta(args.shift()) + ' ' + args.join(', '));
  }
}

module.exports = Url;