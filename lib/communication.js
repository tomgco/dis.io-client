exports.createCommunication = function() {
  var communication = this
    ;

  communication.postMessage = function(){};
  communication.onMessage = function(){};

  return communication;
};