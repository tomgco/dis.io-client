/**
 * This is a browser implementation of the processor for the client
 * @author Tom Gallacher
 */

// imports the communication wrapper to work with webworkers and nodes cluster || child proccess fork
// importScripts('disio-client-communication.js');
// importScripts('workunit.js'); // data URI for the main work unit

//time for some psuedo code
$.get('/distributors', function(data) {
  var max = data.length - 1
    , a = 0 + (Math.random() * ((max - 0) + 1))
    , host = data[Math.floor(a)]
    , uri = 'http://' + host.hosts[0] + ':' + host.port;
  console.log(uri);
  startProcess(uri);
});

function startProcess(uri) {
  var socket = io.connect(uri)
    , workunitId
    ;

  socket.on('connect', function () {
  });

  socket.json.send({"action":"request"});

  socket.on('message', function(message) {
    switch (message.action) {
      // gets the workunit - the js to run a task
      case 'workunit':
        createWorkUnit(message, function() {
          socket.json.send({'action': 'getPayload'});
          workunitId = message.workunitId;
        });
        break;
      // gets the payload, this hold parameters
      case 'payload':
        message.workunitId = workunitId;
        startWorkUnit(message);
        break;
      case 'message':
        console.log(message);
        break;
      default:
        throw new Error('Unknown Message action sent: ' + message.action);
    }
  });

  var state = exports.createState()
    , worker
    ;

  function workerOnMessage(e) {
    var data = e.data
      ;

    switch(data.action) {
      case 'message':
        console.log(data);
        break;
      case 'saveState':
        data.workunitId = workunitId;
        socket.json.send(data);
        // console.log(data);
        // state.setState(data.id, data.state);
        // console.log(state.getState(data.id));
        break;
      case 'completed':
        data.workunitId = workunitId;
        socket.json.send(data);
        // state.clearState();
        break;
    }
  }

  function workerOnError(e) {
    // displays errors in the workers
    // console.log('ERROR: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
    console.log('Worker Error:');
    console.log(e.stack);
  }

  function createWorkUnit(workUnit, cb) {
    // create worker from remote source, this could be very ugly...
    // use socket.io
    // var bb = new BlobBuilder()
    var bb = new WebKitBlobBuilder()
      ;

    $.get('/lib/communication.js', function(data) {
      bb.append(data);
      bb.append(workUnit.data);
      // Note: window.webkitURL.createObjectURL() in Chrome 10+.
      // worker = new Worker(window.URL.createObjectURL(bb.getBlob()));
      worker = new Worker(window.webkitURL.createObjectURL(bb.getBlob()));
      worker.addEventListener('message', workerOnMessage, false);
      worker.addEventListener('error', workerOnError, false);
      cb();
    });
  }

  function startWorkUnit(payload) {
    worker.postMessage({
        'cmd' : 'start'
      , 'payload': payload.data.payload
      , 'id': payload.data.id
      , 'state': state.getState()
    });
  }
}