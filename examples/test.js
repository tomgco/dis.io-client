/*
 * Calculate Series
 */

var digitsGenerated = 0;
var piHex = '';
function S (j, d) {
  var sumLeft = 0;
  /*
   * First Summation
   */
  for (var k = 0; k <= d; k++) {
    var r = 8 * k + j; // 8k + j
    sumLeft += modPow(16, d - k, r) / r;
    sumLeft = sumLeft % 1.0;
  }
  /*
   * Second Summation Used for generating the trailing digits The more
   * cycles performed, the more accurate the precision
   */
  var sumRight = 0;

  var l = d + 1;

  while (true) // To infinity... and beyond!
  {
    var sumConverge = sumRight + Math.pow(16, d - l) / (8 * l + j);
    // Iterate until SumRight no longer changes
    if (sumRight == sumConverge)
      break;
    else
      sumRight = sumConverge;
    l++;
  }
  return sumLeft + sumRight;
}

function generateDigit(d) {
  var Sx = 4 * S(1, d);
  console.log("." + Sx);
  Sx -= 2 * S(4, d);
  console.log("." + Sx);
  Sx -= S(5, d);
  console.log("." + Sx);
  Sx -= S(6, d);
  console.log("." + Sx);

  if (Sx > 0)
    Sx -= parseInt(Sx, 10);

  if (Sx < 0)
    Sx += (1 + parseInt(-Sx, 10));
  Sx *= Math.pow(16, 14);
  var hex = Sx.toString(16);
    
  while (hex.length < 14)
    hex = "0" + hex;

  complete(d, hex);
}

function complete(digit, hex) {
  piHex += hex.substr(0, 1);
  digitsGenerated++;
}

// base, exponent, modulus
function modPow(B, E, M) {
  var result = 1;
  while (E > 0) {
    if ((E & 1) === 1)
      result = (result * B) % M;
    E >>= 1;
    B = (B * B) % M;
  }
  return result % M;
}

// for (var i = 0; i < 1; i++) {
  generateDigit(1337);
// }

console.log('3.' + piHex);