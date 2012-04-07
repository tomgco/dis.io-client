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
   */
  function onMessage(data) {
    worker.onMessage(data);
  }

  function onStart(data) {
    if (data.id === undefined) {
      throw new Error('WorkUnit was started with no id.');
    }
    workUnitId = data.id;
    worker.onStart(data);
  }

  /**
   *  @private
   */
  function postMessage(obj) {
    obj.id = workUnitId;
    if (nodeJS) {
      console.log('node is not yet supported');
    } else {
      worker.postMessage(obj);
    }
  }

  communication.saveState = function(state) {
    postMessage(state);
  };

  communication.end = function(result) {
    result.action = 'completed';
    postMessage(result);
  };

  return communication;
};

var worker = this
  , communication = Communication.createCommunication(worker)
  ;