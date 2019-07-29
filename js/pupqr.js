// pupqr.js

var logo_src = null;
var qrtext = null;

function hideQR() {
  var e1 = document.getElementById("qrback");
  if (e1) e1.parentNode.removeChild(e1);
  var e2 = document.getElementById("qrcode");
  if (e2) e2.parentNode.removeChild(e2);
  var e3 = document.getElementById("qrpic");
  if (e3) e3.parentNode.removeChild(e3);
  var e4 = document.getElementById("qrlogo");
  if (e4) e4.parentNode.removeChild(e4);
  var e5 = document.getElementById("qrframe");
  if (e5) e5.parentNode.removeChild(e5);
}

function makeCode(text) {
  var board = document.getElementsByTagName("body")[0];
  var eb = document.createElement("div");
  eb.id = "qrback";
  eb.className = "qrback";
  eb.tabIndex = -1;
  eb.ondblclick = hideQR;
  eb.onkeydown = function (k) { if (k.keyCode == 13 || k.keyCode == 100 || k.keyCode == 27) hideQR(); }
  board.appendChild(eb);

  var ec = document.createElement("div");
  ec.id = "qrcode";
  ec.className = "qrcode";
  ec.ondblclick = hideQR;
  w = Math.min(300, Math.floor(text.length / 100) * 100 + 100)
  console.log(text.length, w);
  var qrcode = new QRCode(ec, {
    width: w,
    height: w,
    text: text,
    correctLevel: 1,
    typeNumber: 1
  });

  var ef = document.createElement("div");
  ef.id = "qrframe";
  ef.className = "qrframe";
  ef.ondblclick = hideQR;
  ef.append(ec);

  var ep = document.createElement("img");
  ep.id = "qrpic";
  ep.src = logo_src;
  ep.width = w / 5
  ep.height = w / 5

  var el = document.createElement("div");
  el.id = "qrlogo";
  el.className = "qrlogo";
  el.ondblclick = hideQR;
  el.append(ep);
  ef.append(el);

  board.appendChild(ef);
  ec.style.display = 'block';
  eb.focus();
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type == 'show') {
    qrtext = request.data
    if (logo_src) {
      makeCode(qrtext);
      sendResponse(1);
    }
    else {
      sendResponse({'type':'logo'});
    }
  }
  else if (request.type == 'logo') {
    logo_src = request.data
    makeCode(qrtext);
    sendResponse(1);
  }
});
