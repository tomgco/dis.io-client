addEventListener('message', function(e) {
  var data = e.data;
  if(data.cmd === 'start') {
    var a, b, c, start = +Date.now(), end;
    for (var i = 1000000; i >= 0; i--) {
      c = a+ b;
    }
    end = +Date.now();
    postMessage('FLOPS: 1000000/' + ((end - start) / 1000));
  }
}, false);