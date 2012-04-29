var Communication = {};

Communication.createCommunication = function(worker) {
  var communication = this
    , workUnitId
    , nodeJS = false // check if this is being ran using the cli
    ;

  // use different mechanisms for cli version and browser based versions
  if (!nodeJS) {
    worker.addEventListener('message', function(e) {
      var cmd = e.data.cmd;
      switch(cmd) {
        case 'start':
          onStart(e.data);
          break;
        case 'stop':
          break;
        default:
          onMessage(e.data);
      }
    }, false);
  }

  /**
   *  @private
   * Calls the worker when a message is received.
   */
  function onMessage(data) {
    worker.onMessage(data);
  }
  /**
   * Calls the worker after some pre-initialization setup has occurred.
   */
  function onStart(data) {
    if (data.id === undefined) {
      throw new Error('WorkUnit was started with no id.');
    }
    workUnitId = data.id;
    worker.onStart(data);
  }

  /**
   *  @private
   *  PostMessage wrapper so that a server side can use the same library.
   */
  function postMessage(obj) {
    obj.id = workUnitId;
    if (nodeJS) {
      console.log('node is not yet supported');
    } else {
      worker.postMessage(obj);
    }
  }

  /**
   * Adds a saveState function to be called from within a worker.
   * This allows a special object to be sent and labeled with a savedState flag.
   */
  communication.saveState = function(data) {
    var state = {};
    state.action = 'saveState';
    state.state = data;
    postMessage(state);
  };

  /**
   *  Ends the communication and will terminate the work unit after this has been called.
   */
  communication.end = function(result) {
    result.action = 'completed';
    postMessage(result);
  };

  return communication;
};
/**
 *  Binds this to worker for a more readable API for a worker, 
 *  self can also be used as noted by the Web Workers Spec.
 *  Also initializes the communication library.
 */
var worker = this
  , communication = Communication.createCommunication(worker)
  ;