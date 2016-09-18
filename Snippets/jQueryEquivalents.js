////////////////////////////////
////////////////////////////////$(document).ready()
////////////////////////////////

document.addEventListener('DOMContentLoaded', function () {
	console.log('page is ready');
});

////////////////////////////////
////////////////////////////////$.ajax()
////////////////////////////////


var ajax = createXMLHTTPObject();

function createXMLHTTPObject() {
	try{
		return new XMLHttpRequest()
	}catch(e){}
	try{
		return new ActiveXObject("Msxml3.XMLHTTP")
	}catch(e){}
	try{
		return new ActiveXObject("Msxml2.XMLHTTP.6.0")
	}catch(e){}
	try{
		return new ActiveXObject("Msxml2.XMLHTTP.3.0")
	}catch(e){}
	try{
		return new ActiveXObject("Msxml2.XMLHTTP")
	}catch(e){}
	try{
		return new ActiveXObject("Microsoft.XMLHTTP")
	}catch(e){}
	console.log("ERROR! Coult not initialize AJAX!");
	return null;
}