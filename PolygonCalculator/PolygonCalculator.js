const SQRT_3 = Math.sqrt(3);


var state = {
	shouldRepaintEverything:true,//so that we get one repaint at the start
	shouldClearAll:false,
	shouldRecalculateArea:true,
}


var canvas = document.getElementById("canvas");
var fileInput = document.getElementById("file_input");
var scale = document.getElementById("scale");
var areaOutput = document.getElementById("area");
var areaRatioOutput = document.getElementById("area_ratio");
var colorSelection = document.getElementById("color");
var c2 = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.oncontextmenu = function (e) {
	e.preventDefault();
};


var input ={
	isShift:false,
	lastSeenMouseX:-1,
	lastSeenMouseY:-1,
	isMouseDown:false,
	hasMouseMovedWhileDown:false,
	mouseX:-1,
	mouseY:-1,
	setMousePositon:function(x,y){
		this.lastSeenMouseX = this.mouseX;
		this.lastSeenMouseY = this.mouseY;
		this.mouseX = x;
		this.mouseY = y;
	},
	getRelativeX:function(){
		return this.mouseX-this.lastSeenMouseX;
	},
	getRelativeY:function(){
		return this.mouseY-this.lastSeenMouseY;
	},
	mouseListeners:{
		onClick:undefined,
		onDrag:undefined,
		onDrop:undefined,
		onPress:undefined,
		onRelease:undefined,
	}
	
}


window.addEventListener('resize', function(event){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	state.shouldRepaintEverything = true;
});

canvas.onmousedown= function (event){
	input.isMouseDown = true;
	input.hasMouseMovedWhileDown=false;
	if(input.mouseListeners.onPress!=undefined)input.mouseListeners.onPress();
}


canvas.onmouseup = function (event){
	input.isMouseDown = false;
	if(input.mouseListeners.onRelease!=undefined)input.mouseListeners.onRelease();
	if(input.hasMouseMovedWhileDown){
		if(input.mouseListeners.onDrop!=undefined)input.mouseListeners.onDrop();
	}else{
		if(input.mouseListeners.onClick!=undefined)input.mouseListeners.onClick();
	}
}

canvas.onmousemove = function (event){
	var rect = canvas.getBoundingClientRect();
	input.setMousePositon(event.clientX-rect.left,event.clientY-rect.top);
	
	if(input.isMouseDown){
		input.hasMouseMovedWhileDown=true;
		if(input.mouseListeners.onDrag!=undefined)input.mouseListeners.onDrag();
	}
}

fileInput.onchange = function (e) {
    var URL = window.webkitURL || window.URL;
    var url = URL.createObjectURL(e.target.files[0]);
    shapes.image.data = new Image();
    shapes.image.data.src = url;
    shapes.image.data.onload = function() {
		state.shouldClearAll=true;
		state.shouldRepaintEverything=true;
    }
};

scale.onchange = function(e){
	shapes.image.scale=e.target.value;
	if(shapes.image.data!=null){
		state.shouldClearAll=true;
		state.shouldRepaintEverything=true;
	}
}


colorSelection.onchange=function(e){
	mechanism.switchColor(e.target.value); 
	state.shouldClearAll=true;
	state.shouldRepaintEverything=true;
}




var rendering = { 
	translateX:0,
	translateY:0,

	translate:function (x,y){
		this.translateX+=x;
		this.translateY+=y;
	},
	setTranslate:function (x,y){
		this.translateX=x;
		this.translateY=y;
	},
	drawPolygon:function (points){
		if(points.length < 2)return;

		c2.moveTo(points[0]+this.translateX, points[1]+this.translateY);
		for(var ix = 2,l=points.length;ix+1<l;ix+=2){
			c2.lineTo(points[ix]+this.translateX,points[ix+1]+this.translateY);
		}
		c2.lineTo(points[0]+this.translateX, points[1]+this.translateY);
	},
	drawLines:function(points){
		for(var i = 0,l=points.length;i+3<l;i+=4){
			c2.moveTo(points[i]+this.translateX, points[i+1]+this.translateY);
			c2.lineTo(points[i+2]+this.translateX,points[i+3]+this.translateY);
		}
	}
}


var shapes ={
	mapX:0,
	mapY:0,
	cross:{
		points:undefined,		
		draw:function(x,y){
			shapes.setTranslate(x,y);
			rendering.drawLines(this.points);
		},
		generate:function (size){
			var half = size/2;
			this.points=[-half,0/**/,half,0/**/,0,half/**/,0,-half/**/];
		}
	},
 	data:{
		points:null,
		draw:function(points){
			shapes.setTranslate(0,0);
			rendering.drawPolygon(points);
		},
		add:function(x,y){
			this.points.push(x,y);
		},
		set:function(x,y,pointIndex){
			this.points[this.getPointXIndex(pointIndex)]=x;
			this.points[this.getPointYIndex(pointIndex)]=y;
		},
		move:function(movementX,movementY,pointIndex){
			this.points[this.getPointXIndex(pointIndex)]+=movementX;
			this.points[this.getPointYIndex(pointIndex)]+=movementY;
		},
		getPointXIndex:function(pointIndex){
			return pointIndex*2;
		},
		getPointYIndex:function(pointIndex){
			return pointIndex*2+1;
		},
		getPointX:function(pointIndex){
			return this.points[this.getPointXIndex(pointIndex)];
		},
		getPointY:function(pointIndex){
			return this.points[this.getPointYIndex(pointIndex)];
		},
		getPointsNumber:function(){
			return Math.floor(this.points.length/2);
		},
		remove:function(pointIndex){
			this.points.splice(this.getPointX(pointIndex),1);
			this.points.splice(this.getPointY(pointIndex),1);
		},
		findPoint:function(x,y,pointSize){
			function isInsidePoint(mouseX,mouseY,pointX,pointY,pointSize){
				var distance = Math.sqrt(Math.pow(mouseX-pointX,2)+Math.pow(mouseY-pointY,2));
				return distance<=pointSize;
			}
			for(var i=0;i+1<this.points.length;i+=2){
				if(isInsidePoint(x,y,this.points[i],this.points[i+1],pointSize)){
					return Math.floor(i/2);
				}
			}
			return -1;
		},
		calculateArea:function() { 
			var area = 0;         // Accumulates area in the loop
			var j = this.getPointsNumber()-1;  // The last vertex is the 'previous' one to the first
			
			for (var i=0; i<this.getPointsNumber(); i++){
				area = area +  (this.getPointX(j)+this.getPointX(i)) * (this.getPointY(j)-this.getPointY(i)); 
				j = i;  //j is previous vertex to i
			}
			
			return Math.abs(area/2);
		}
	},
	image:{
		data:null,
		scale:1,
		draw:function(){
			if(this.data!=null){
        		c2.drawImage(this.data, 0, 0, this.data.width*this.scale, this.data.height*this.scale);
			}
		}

	},

	setTranslate:function(x,y){
		rendering.setTranslate(this.mapX+x,this.mapY+y);
	},

	
	moveMap:function(relativeX,relativeY){
		
		this.mapX+=relativeX;
		this.mapY+=relativeY;
	},
	getMouseXOnMap:function(){
		return input.mouseX-this.mapX;
	},
	getMouseYOnMap:function(){
		return input.mouseY-this.mapY;
	}
}


function PaintingClass(width,height,defaultValue){
	
	function beginDrawing(){
		c2.beginPath();
		c2.lineWidth = 1;
	}
	function endDrawing(){
		c2.stroke();
	}
	function setFontProperties(){
		c2.textAlign = "center";
		c2.font = "50px Arial";
		c2.fillStyle = "black"
	}
	this.repaint=function (){
		//repaint hexagons
		beginDrawing();
		shapes.image.draw();
		c2.strokeStyle = "black";
		for(var i=0;i+1<shapes.data.points.length;i+=2){
			shapes.cross.draw(shapes.data.points[i],shapes.data.points[i+1]);
		}
		endDrawing();

		for(var i=0;i<mechanism.pointsPerColor.length;i++){
			beginDrawing();
			c2.strokeStyle =  mechanism.namePerColor[i];
			shapes.data.draw(mechanism.pointsPerColor[i]);
			endDrawing();
		}
		c2.strokeStyle="black";


		
		//repaint text
		// setFontProperties();
		//todo
	}
	
	
	this.clearAll=function(){
		c2.clearRect(0, 0, canvas.width, canvas.height);
	}
}

window.onkeyup = function (event){
	switch(event.keyCode){
		case 16://shift
		input.isShift =false;
		break;
	}
}
window.onkeydown = function(event){
	console.log(event.keyCode);
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
		case 16://shift
		input.isShift=true;
		break;
		case 192:
		command.promptForCommand();
		break;
	}
}




var painting;

window.onload = function(){
	painting = new PaintingClass(10,10,0);
	
	shapes.cross.generate(40);
	shapes.data.points=mechanism.getCurrentPoints();
	colorSelection.value="0";
};


var mechanism ={
	isPointDragged:-1,
	pointsPerColor:[[],[]],
	namePerColor:["red","green"],
	areaPerColor:[0,0],
	currentColor:0,
	switchColor:function(color){
		if(shapes.data.points!=null||shapes.data.points!=undefined){
			this.pointsPerColor[this.currentColor]= shapes.data.points;
		}
		shapes.data.points=this.pointsPerColor[color];
		this.currentColor=color;
		state.shouldRecalculateArea=true;
		state.shouldRepaintEverything=true;
		state.shouldClearAll=true;
	},
	getRedArea:function(){
		return this.areaPerColor[0];
	},
	getGreenArea:function(){
		return this.areaPerColor[1];
	},
	getCurrentPoints:function(){
		return this.pointsPerColor[this.currentColor];
	},
	setCurrentArea:function(area){
		this.areaPerColor[this.currentColor]=area;
	},
	recalculateAreaRatio:function(){
		areaRatioOutput.innerText=(Math.floor(this.getRedArea()/this.getGreenArea()*100*100)/100) +"%";
	}
	
}


input.mouseListeners.onPress=function(){
	mechanism.isPointDragged=shapes.data.findPoint(shapes.getMouseXOnMap(),shapes.getMouseYOnMap(),10);
}

input.mouseListeners.onDrag=function(){
	if(mechanism.isPointDragged>-1){
		shapes.data.move(input.getRelativeX(),input.getRelativeY(),mechanism.isPointDragged);
		state.shouldRecalculateArea=true;
	}else{
		shapes.moveMap(input.getRelativeX(),input.getRelativeY());
	}
	state.shouldRepaintEverything=true;
	state.shouldClearAll = true;
}

input.mouseListeners.onClick=function(){
	shapes.data.add(shapes.getMouseXOnMap(),shapes.getMouseYOnMap());
	state.shouldRecalculateArea=true;
	state.shouldRepaintEverything=true;
	state.shouldClearAll = true;
}




setInterval(function(){
	if(state.shouldRepaintEverything){
		if(state.shouldClearAll){
			painting.clearAll();
		}
		painting.repaint();
		state.shouldRepaintEverything=false;
	}
	if(state.shouldRecalculateArea){
		var area=shapes.data.calculateArea();
		mechanism.setCurrentArea(area);
		areaOutput.innerText= area;
		mechanism.recalculateAreaRatio();
		state.shouldRecalculateArea=false;
	}
},10);

