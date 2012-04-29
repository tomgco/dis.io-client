/**
 * Creates a simple webserver that serves up the client.
 */

var express = require('express')
  , app = express.createServer()
  , io = require('socket.io').listen(app)
  , http = require('http')
  ;

app.configure(function(){
    app.use(express.static(__dirname));
    app.use(app.router);
});

// Listen on localhost:3001
app.listen(3001);

// Return the test page for running the client.
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/test/index.html');
});

// return avalible distributors, proof of concept.
app.get('/distributors', function (req, res) {
  var host = process.argv[2] || 'magellanic.local';
  http.get({
      host: host
    , port: 3000
    , path: '/distributors'
  }, function(a) {
    var data = "";
    a.setEncoding('utf8');
    a.on('data', function (chunk) {
      data += chunk;
    });

    a.on('end', function() {
      console.log(data);
      if (a.statusCode === 200) {
        res.json(JSON.parse(data));
      } else {
        res.end(500);
      }
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    res.end(500);
  });
});

io.sockets.on('connection', function (socket) {
  console.log('no!');
});