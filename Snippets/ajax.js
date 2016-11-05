var ajax = {}
ajax.x = function createXMLHTTPObject() {
	try {
		return new XMLHttpRequest()
	} catch (e) {
	}
	try {
		return new ActiveXObject("Msxml3.XMLHTTP")
	} catch (e) {
	}
	try {
		return new ActiveXObject("Msxml2.XMLHTTP.6.0")
	} catch (e) {
	}
	try {
		return new ActiveXObject("Msxml2.XMLHTTP.3.0")
	} catch (e) {
	}
	try {
		return new ActiveXObject("Msxml2.XMLHTTP")
	} catch (e) {
	}
	try {
		return new ActiveXObject("Microsoft.XMLHTTP")
	} catch (e) {
	}
	console.log("ERROR! Coult not initialize AJAX!");
	return null;
};

ajax.send = function(url, callback, method, data, async) {
	if (async === undefined) {
		async = true;
	}
	var x = ajax.x();
	x.open(method, url, async);
	x.onreadystatechange = function() {
		if (x.readyState == 4) {
			callback(x.responseText)
		}
	};
	if (method == 'POST') {
		x.setRequestHeader('Content-type',
				'application/x-www-form-urlencoded');
	}
	x.send(data)
};

ajax.get = function(url, data, callback, async) {
	var query = [];
	for ( var key in data) {
		query.push(encodeURIComponent(key) + '='
				+ encodeURIComponent(data[key]));
	}
	ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback,
			'GET', null, async)
};

ajax.post = function(url, data, callback, async) {
	var query = [];
	for ( var key in data) {
		query.push(encodeURIComponent(key) + '='
				+ encodeURIComponent(data[key]));
	}
	ajax.send(url, callback, 'POST', query.join('&'), async)
};