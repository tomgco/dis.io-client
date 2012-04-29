/**
 * Gives visual feedback of howmany workunit have been completed.
 * This is only used for during the testing stages.
 */
 var stats = {
        numCompleted: 0
      , progress: {}
    };
// Updates the ever 1.8 seconds.
setInterval(function() {
  $('body').text(JSON.stringify(stats));
}, 1800);

/**
 * This is a browser implementation of the processor for the client
 * @author Tom Gallacher
 */

// imports the communication wrapper to work with webworkers and nodes cluster || child proccess fork
// importScripts('disio-client-communication.js');
// importScripts('workunit.js'); // data URI for the main work unit

/**
 *  This is also proof of concept code which will start the process when it has found a URL to
 * connect to. Usually this will be offloaded to a loadbalancer and in turn that address would
 * be passed to `startProcess()`
 */
$.get('/distributors', function(data) {
  var max = data.length - 1
    , a = 0 + (Math.random() * ((max - 0) + 1))
    , host = data[Math.floor(a)]
    , uri = 'http://' + host.hosts[0] + ':' + host.port;
  console.log(uri);
  startProcess(uri);
});

function startProcess(uri) {
  /**
   * Initializes socket.io, a web sockets library to enable communication.
   */
  var socket = io.connect(uri)
    , workunitId
    ;
  // Listen on the connect event for a client.
  socket.on('connect', function () {
  });

  // Send a request message, which will be sent when a connection is made.
  socket.json.send({"action":"request"});

  // Listen on a message from a distributor and the decide how to interpret it.
  socket.on('message', function(message) {
    switch (message.action) {
      // gets the work unit - the js to run a task
      case 'workunit':
        createWorkUnit(message, function() {
          // Asks for a payload, to know what parameter a work unit should be started with.
          socket.json.send({'action': 'getPayload'});
          workunitId = message.workunitId;
        });
        break;
      // gets the payload, this hold parameters
      case 'payload':
        message.workunitId = workunitId;
        // Start the work unit with the acquired payload.
        startWorkUnit(message);
        break;
      case 'message':
        // Log a message to the JavaScript Console.
        console.log(message);
        break;
      default:
        // throw an error when a unknown message is sent.
        throw new Error('Unknown Message action sent: ' + message.action);
    }
  });

  //var state = exports.createState()
  var worker
    ;
  /**
   * Function which is called when a work unit in a Web Worker sends a message.
   */
  function workerOnMessage(e) {
    var data = e.data
      ;

    switch(data.action) {
      case 'message':
        // Log a message from the web worker.
        console.log(data);
        break;
      case 'saveState':
        // send a state save message to a distributor.
        data.workunitId = workunitId;
        socket.json.send(data);
        break;
      case 'completed':
        // Set payload as completed, send data and increment stats.
        data.workunitId = workunitId;
        socket.json.send(data);

        stats.progress = data;
        stats.numCompleted++;
        break;
    }
  }

  function workerOnError(e) {
    // displays errors in the workers
    // console.log('ERROR: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
    console.log('Worker Error:');
    console.log(e.stack);
  }
  /**
   * create work unit from a remote source, this allows the communication library to be added
   * from a CDN.
   */
  function createWorkUnit(workUnit, cb) {
    /**
     * currently BlobBuilder is only working for Webkit, however for future versions the following
     * should be used:
     * var bb = new BlobBuilder()
     */
    var webkit = false
      , firefox = false
      ;

    if (typeof WebKitBlobBuilder !== 'undefined') {
      webkit = true;
      BlobBuilder = WebKitBlobBuilder;
    } else if (typeof MozBlobBuilder !== 'undefined') {
      firefox = true;
      BlobBuilder = MozBlobBuilder;
    }

    var bb = new BlobBuilder()
      ;

    // retrieve communication library.
    $.get('/lib/communication.js', function(data) {
      bb.append(data);
      bb.append(workUnit.data);
      // Note: window.webkitURL.createObjectURL() in Chrome 10+.
      // worker = new Worker(window.URL.createObjectURL(bb.getBlob()));
      if (webkit) worker = new Worker(window.webkitURL.createObjectURL(bb.getBlob()));
      else if (firefox) worker = new Worker(window.URL.createObjectURL(bb.getBlob()));
      worker.addEventListener('message', workerOnMessage, false);
      worker.addEventListener('error', workerOnError, false);
      cb();
    });
  }

  /**
   *  Starts the work unit in a new thread with the supplied payload.
   */
  function startWorkUnit(payload) {
    worker.postMessage({
        'cmd' : 'start'
      , 'payload': payload.data.payload
      , 'id': payload.data.id
    });
  }
}