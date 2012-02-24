exports.createCommunication = function(worker) {
  var communication = this
    , workUnitId
    , nodeJS = (process !== undefined) // check if this is being ran using the cli
    ;

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

// receive based commands
  function onMessage(data) {
    worker.onMessage(data);
  }

  function onStart(data) {
    if (workUnitId !== undefined) {
      throw new Error('WorkUnit has been started twice.');
    } else if (data.workUnitId === undefined) {
      throw new Error('WorkUnit was started with no id.');
    }
    workUnitId = data.workUnitId;
    worker.onStart(data);
  }

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
    result.finished = true;
    postMessage(result);
  };

  return communication;
};