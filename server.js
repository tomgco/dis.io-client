var express = require('express')
  , app = express.createServer()
  , io = require('socket.io').listen(app);

app.configure(function(){
    app.use(express.static(__dirname));
    app.use(app.router);
});

app.listen(3001);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/test/index.html');
});

io.sockets.on('connection', function (socket) {
  console.log('no!');
});