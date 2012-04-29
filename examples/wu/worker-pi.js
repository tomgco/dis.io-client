/**
 * This is a modified version of test.js and is currently conforming with the latest
 * version of the artifact.
 * Currently it saves a state asynchronously at 25%, 50% and 75% and then ends the work unit
 * when completed.
 */
function series(j, d) {
  var s = 0 // sum left
    , t = 0 // sum right
    ;

  for (var k = 0; k <= d; k++) {
    var r = 8 * k + j;
    s += modPow(16, d - k, r) / r;
    s = s % 1.0;
  }

  var l = d + 1;

  for (var c = t + Math.pow(16, d - l) / (8 * l + j) ;; l++) {
    if (t === c) {
      break;
    } else {
      t = c;
    }
  }
  return s + t;
}

function piHexDigits(n, step) {
  // main of implementation arrays holding formulae coefficients
  var start = +Date.now();
  var a = [4, 2, 1, 1]
    , j = [1, 4, 5, 6]
    , x
    , hex
    , p = 0
    ;

  // Put these into a new thread.

  step[0] = step[0] || a[0] * series(j[0], n);

  // send progress message
  communication.saveState({
      n: n
    , step:step
    }
  );

  step[1] = step[1] || a[1] * series(j[1], n);

  // send progress message
  communication.saveState({
      n: n
    , step:step
    }
  );

  step[2] = step[2] || a[2] * series(j[2], n);

  // send progress message
  communication.saveState({
      n: n
    , step:step
    }
  );

  step[3] = step[3] || a[3] * series(j[3], n);

  x =  step[0];
  x -= step[1];
  x -= step[2];
  x -= step[3];

  if (x > 0) {
    x -= parseInt(x, 10);
  }

  if (x < 0) {
    x += (1 + parseInt(-x, 10));
  }

  x *= Math.pow(16, 14);

  hex = x.toString(16);

  // for (;hex.length < 14;) {
  //   hex = '0' + hex;
  // }
  hex = new Array(15 - hex.length).join('0') + hex;
  communication.end({
      n: n
    , hex: hex
    , time: end = +Date.now() - start
    , date: Date()
    }
  );
}

// base, exponent, modulus
var modPow = function(b, e, m) {
  var result = 1;
  while (e > 0) {
    if ((e & 1) === 1) {
      result = (result * b) % m;
    }
    e >>= 1;
    b = (b * b) % m;
  }
  return result % m;
};

/**
 * @Required
 * called when a work unit is called, this is part of the Web Worker API
 */
worker.onStart = function(data) {
  piHexDigits(
      data.payload.n
    , data.payload.step
  );
};

/**
 *  @optional
 * This is called when a worker receives a message.
 * Currently not implemented in processor.js, however can be used in the future for
 * notifying clients that a distributor is about to shutdown.
 */
worker.onMessage = function(data) {
};