function hex2dec(hex) {
  var iz = "";
  var v = "";
  var pos = 0;
  var g = 0;
  var m = 0;
  var nUpower = 0;
  var nSprod = 0;
  var lst = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var pw3 = 16; // base
  var sNumber = hex;
  sNumber = sNumber.toUpperCase();
  // sNumber = stripBad3(sNumber);
  var j =  sNumber.length;
  var π;
  for (var k=0; k < j; k++) {
  iz = sNumber.charAt(k);
  pos = lst.indexOf(iz);
  nUpower = k+1;
  nSprod = Math.pow(pw3, -nUpower);
  m=pos*nSprod;
  g = g+m;
  v = "" + g;
  var vj =  v.length;
  π = v.substring(1, vj);
  }
  return π;
}

console.log('3' + hex2dec('243f6a8885a308d313198a2e03707344a4093822299f31d0082efa98ec4e6c89452821e638d01377be5466cf34e90c6cc0ac'));