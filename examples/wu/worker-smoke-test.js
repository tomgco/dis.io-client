// Required
worker.onStart = function(data) {
  Communication.end({ msg: 'no smoke without fire =]'});
};

// optional
worker.onMessage = function(data) {
};