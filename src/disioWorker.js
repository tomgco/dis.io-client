/**
 * This is a browser implementation of the processor for the client
 * @author Tom Gallacher
 */

 //Stop JS lint whining about jquery && BlobBuilder
var $
  , BlobBuilder
  ;

// imports the communication wrapper to work with webworkers and nodes cluster || child proccess fork
// importScripts('disio-client-communication.js');
// importScripts('workunit.js'); // data URI for the main work unit

//time for some psuedo code
$(function() {
  var State = exports.createState()
    , worker
    ;

  function workerOnMessage(e) {
    var data = JSON.parse(e.data)
      ;
    switch(data.type) {
      case 'message':
        break;
      case 'saveState':
          State.setState(data.state);
        break;
      case 'completion':
          $.post('http://proxy.tomg.co', data, function(res) {
            if (res.statusCode === 200) {
              State.clearState();
            } else {
              // start again!
            }
          });
        break;
    }
  }

  function workerOnError(e) {
    console.log('ERROR: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
  }

  // create worker from remote source, this could be very ugly...
  function createWorker(workUnit) {
    var bb = new BlobBuilder()
      ;

    bb.append(data);
    // Note: window.webkitURL.createObjectURL() in Chrome 10+.
    worker = new Worker(window.URL.createObjectURL(bb.getBlob()));

    worker.addEventListener('message', workerOnMessage, false);
    worker.addEventListener('error', workerOnError, false);

    // Start worker without
  }

  function getWorkUnit() {
    $.get('http://proxy.tomg.co', createWorker);
  }

  getWorkUnit();

  worker.postMessage({
      'cmd' : 'start'
    , 'state': State.getSerialised()
  });
});