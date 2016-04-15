//global variables
var canvas = document.getElementById("canvas");
var isDebug = false;
//canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.addEventListener("mousedown",onMouseDown,false);
//windows
window.addEventListener("keydown",onKeyDown,false);
window.onLoad = load();

function onMouseDown(event){
	console.log(event.pageX+"/"+window.innerWidth+" "+event.pageY+"/"+window.innerHeight);
}

function promptForCommand(){
	var commnadCode = prompt("command=");
	switch(commnadCode){
		case "debug":
		isDebug=!isDebug;
		break;
	}
}



function onKeyDown(event){
	// console.log(event.keyCode);

	switch(event.keyCode){
		// case 65:
		// case 37:
		// 	goLeft();
		// 	break;
		// case 87:
		// case 38:
		// 	goUp();
		// 	break;
		// case 83:
		// case 40:
		// 	goDown();
		// 	break;
		// case 68:
		// case 39:''
		// 	goRight();
		// 	break;
		case 192:
			promptForCommand();
			break;

	}
}


function load() {
    ajaxLoadMap("test");
}



function parseMapFromText(text){
	console.log(text);
}

function ajaxLoadMap(map){
	fireAjax("GET","maps/"+map,parseMapFromText)
}


function fireAjax(option,URL,parsingFunction){
	var file = createXMLHTTPObject();
    file.open(option, URL, true);
    file.onreadystatechange = function() {
		if (file.readyState === 4) {  // Makes sure the document is ready to parse
			if (file.status === 200) {  // Makes sure it's found the file
				parsingFunction(file.responseText);
			}else{
				console.log("File not found! " +URL);
			}
		}else{
			console.log("Document not ready to parse! "+ URL);
		}
    }
    file.send();
}


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
