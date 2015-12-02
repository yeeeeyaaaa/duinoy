var Url = function (options) {
	this.log('info', 'initializing');
  this.debug = options && options.debug || false;
  this.host = options || 'http://192.168.1.51';
  this.port = option || '8080'
  this.pin = options || '1';
  this.call = options || 'analog';
}

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
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
  });
}

var req = http.get(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
//req.write("hello world!");
//req.end();
return str;
}