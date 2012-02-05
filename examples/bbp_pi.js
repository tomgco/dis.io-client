// ported from sympy - ntheory/bbp_pi.py
var digitsGenerated = 0
  , piHex = ''
  , start = Date.now()
  , end
  ;

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

function piHexDigits(n, step0, step1, step2, step3) {
  // main of implementation arrays holding formulae coefficients
  // move out?

  var a = [4,2,1,1]
    , j = [1,4,5,6]
    , x
    , hex
    , step =
      [ step0
      , step1
      , step2
      , step3
      ]
    , p = 0
    ;

  step[p] = step[p] || a[p] * series(j[p++], n);

  // send progress message
  sendMessage(n, step);

  step[p] = step[p] || a[p] * series(j[p++], n);

  // send progress message
  sendMessage(n, step);

  step[p] = step[p] || a[p] * series(j[p++], n);

  // send progress message
  sendMessage(n, step);

  step[p] = step[p] || a[p] * series(j[p++], n);

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

  while (hex.length < 14) {
    hex = '0' + hex;
  }

  complete(n, hex);
}

function complete(digit, hex) {
  piHex += hex.substr(0, 1);
  digitsGenerated++;
}

// base, exponent, modulus
var modPow = function(B, E, M) {
  var result = 1;
  while (E > 0) {
    if ((E & 1) === 1) {
      result = (result * B) % M;
    }
    E >>= 1;
    B = (B * B) % M;
  }
  return result % M;
};

var sendMessage = function(n, step) {
  console.log(step);
};

// for (var i = 0; i < ; i++) {
  piHexDigits(1000000);
// }

end = Date.now() - start;
// console.log('3.' + piHex);
console.log(end.toString() + 'ms');