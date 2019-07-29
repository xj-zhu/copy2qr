// background.js

function getBase64Image(imgfile, cb) {
	var img = new Image();
	img.src = imgfile + '?v=' + Math.random();

	img.onload = function () {
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, img.width, img.height);
		var dataURL = canvas.toDataURL("image/png");
		if (cb) {
			cb(dataURL);
		}
	}
}

function getCurrentTabId(callback) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if (callback) callback(tabs.length ? tabs[0].id : null);
	});
}

function sendMessageToContentScript(message, callback) {
	getCurrentTabId((tabId) => {
		chrome.tabs.sendMessage(tabId, message, function (response) {
			if (callback) callback(response);
		});
	});
}

function copy2QR(params, is_link) {
	// 获取当前选项卡ID
	sendMessageToContentScript({ 'type': 'show', 'data': is_link ? params.linkUrl : params.selectionText }, (response) => {
		if (response) {
			if (response.type == 'logo') {
				getBase64Image('../img/icon.png', function (b64data) {
					sendMessageToContentScript({ 'type': 'logo', 'data': b64data }, (response) => {
						// if (response);
					});
				});
			}
		}
	});
}

chrome.contextMenus.create({
	title: '选中复制为二维码',
	contexts: ['selection'],
	onclick: function (params) {
		copy2QR(params, false);
	}
});
chrome.contextMenus.create({
	title: '链接复制为二维码',
	contexts: ["link"],
	onclick: function (params) {
		copy2QR(params, true);
	}
});