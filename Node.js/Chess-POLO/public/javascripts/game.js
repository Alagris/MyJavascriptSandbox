const TILE_NAMES = ["active","inactive","hyperactive","emitters"];
const TILE_COLORS = ["#B1E2F2","#484F52","#CF70DB","#F74D4D"];
const PLAYER_NAMES = ["William","Heloise","Dmitriy","Agata"];
const PLAYER_COLORS = ["#07F242","#0742F2","#F207B7","#F2B707"];
const TYPE_OF_MYSELF = 0;
const SQRT_3 = Math.sqrt(3);

var canvas = document.getElementById("canvas");
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
	selectedHexX:undefined,
	selectedHexY:undefined,
	isPlayerDragAndDropEnabled:false,
	setMousePossiton:function(x,y){
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
	updateSelectedHexagonPosition:function(){
		//x,y relative to map:
		var x = this.mouseX-shapes.mapX+shapes.hexagon.radius;
		var y = this.mouseY-shapes.mapY+shapes.hexagon.halfOfHeight;
		//cell width = shapes.hexagon.radius*1.5
		//cell height = shapes.hexagon.halfOfHeight
		//cell x and y position:
		this.selectedHexX = Math.floor(x/(shapes.hexagon.radius*1.5));
		this.selectedHexY = Math.floor(y/shapes.hexagon.halfOfHeight);
		//x,y relative to the cell they are in:
		x %= shapes.hexagon.radius*1.5;
		y %= shapes.hexagon.halfOfHeight;
		if(x<shapes.hexagon.radius/2){
			if((this.selectedHexY & 1) ^ (this.selectedHexX & 1)){
				//if one odd and the other one even
				if(y > x*SQRT_3){
					this.selectedHexX--;
				}
			}else{
				//if both odd or both even
				if(y < shapes.hexagon.halfOfHeight-x*SQRT_3){
					this.selectedHexX--;
				}
			}
		}
		this.selectedHexY =(this.selectedHexX & 1)? Math.floor((this.selectedHexY-1)/2):Math.floor(this.selectedHexY/2);
	}
}

var mechanism;

function Mechanisms(){
	var luck = [1,1,1,1];
	const turnsCountToSpawnNewUnits=5;
	var turnNumber=0;
	this.onNextTurn = function(){
		var a = painting.getMapArea();
		if(turnNumber==turnsCountToSpawnNewUnits){
			turnNumber=1;
			for(var i = 0;i<a;i++){
				var tile = painting.getInMapByIndex(i);
				if (tile == 2){//if it's hyperactive tile
					var playerOwningIt = painting.getPlayerTypeInMapByIndex(i);
					if (playerOwningIt > -1){//and it is captured
						//then we shall increase count of player units on that tile
						painting.increasePlayerInMapByIndex(i,playerOwningIt,1);
					}
				}
			}
		}else{
			turnNumber++;
		}
	}

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
}

window.addEventListener('resize', function(event){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	state.shouldRepaintEverything = true;
});

canvas.onmousedown= function (event){
	input.isMouseDown = true;
	input.updateSelectedHexagonPosition();
	input.hasMouseMovedWhileDown=false;
	if(!command.isDebug && painting.isPositionValid(input.selectedHexX,input.selectedHexY)  && TYPE_OF_MYSELF==painting.getPlayerTypeInMap(input.selectedHexX,input.selectedHexY)){
		input.isPlayerDragAndDropEnabled =true;//dragging started
	}
}


canvas.onmouseup = function (event){
	input.isMouseDown = false;
	if(input.isPlayerDragAndDropEnabled){//player dropped
		var startX=input.selectedHexX;
		var startY=input.selectedHexY;
		input.updateSelectedHexagonPosition();
		if(painting.getInMap(input.selectedHexX,input.selectedHexY)!=1){//can't move on inactive tiles
			if(painting.isAdjacent(input.selectedHexX,input.selectedHexY,startX,startY)){
				//dropping here is allowed
				painting.increasePlayerInMap(startX,startY,TYPE_OF_MYSELF,-1);
				painting.increasePlayerInMap(input.selectedHexX,input.selectedHexY,TYPE_OF_MYSELF,1);
				//humand did his/her turn
				//now it's time for bots
				mechanism.onNextTurn();
			}
		}
		input.isPlayerDragAndDropEnabled=false;
		state.shouldRepaintEverything=true;
		state.shouldClearAll = true;
	}
	if(!input.hasMouseMovedWhileDown){
		if(painting.isPositionValid(input.selectedHexX,input.selectedHexY)){
			if(command.isDebug){
				if(command.selectedTileType>= TILE_COLORS.length){
					painting.increasePlayerInMap(input.selectedHexX,input.selectedHexY,command.selectedTileType-TILE_COLORS.length-1,1);
					painting.repaintSingleHex(input.selectedHexX,input.selectedHexY,TILE_COLORS[command.selectedTileType]);
				}else{
					painting.setInMap(input.selectedHexX,input.selectedHexY,command.selectedTileType);
					painting.repaintSingleHex(input.selectedHexX,input.selectedHexY,TILE_COLORS[command.selectedTileType]);
				}
			}
		}
	}
}

canvas.onmousemove = function (event){
	input.setMousePossiton(event.pageX,event.pageY);
	if(input.isMouseDown){
		input.hasMouseMovedWhileDown=true;
		if(!input.isPlayerDragAndDropEnabled){
			shapes.moveMap(input.getRelativeX(),input.getRelativeY());
		}//else player is dragged
		state.shouldRepaintEverything=true;
		state.shouldClearAll = true;
	}
}


var command = {
	selectedTileType:1,
	isDebug:false,
	promptForCommand:function(){
		var commnadCode = prompt("command=").split(" ");
		switch(commnadCode[0]){
			case "debug":
			this.isDebug=!this.isDebug;
			break;
			case "area":
			if(this.isDebug){
				var w = parseInt(commnadCode[1]);
				var h = parseInt(commnadCode[2]);
				if(w != NaN && h != NaN){
					state.shouldRepaintEverything=true;
					state.shouldClearAll = true;
					painting = new PaintingClass(w,h,0);
				}
			}
			break;
			case "type":
			if(this.isDebug){
				var t = parseInt(commnadCode[1]);
				if(t != NaN){
					this.selectedTileType = t;
				}
			}
			break;
			case "player":
			if(this.isDebug){
				var t = parseInt(commnadCode[1]);
				if(t != NaN){
					this.selectedTileType = TILE_COLORS.length+ t+1;
				}
			}
			break;
		}
	}
}



var rendering = { 
	translateX:0,
	translateY:0,

	translate:function (x,y){
		translateX+=x;
		translateY+=y;
	},
	drawPolygon:function (points){
		if(points.length < 2)return;

		c2.moveTo(points[0]+this.translateX, points[1]+this.translateY);
		for(var ix = 2,l=points.length;ix+1<l;ix+=2){
			c2.lineTo(points[ix]+this.translateX,points[ix+1]+this.translateY);
		}
		c2.lineTo(points[0]+this.translateX, points[1]+this.translateY);
	},
	translateToHex:function(x,y){
		if(x%2==0){
			this.translateX = shapes.mapX+x*shapes.hexagon.radius *1.5;
			this.translateY = shapes.mapY+y*shapes.hexagon.halfOfHeight*2;
		}else{
			this.translateX = shapes.mapX+x*shapes.hexagon.radius *1.5;
			this.translateY = shapes.mapY+(y+0.5)*shapes.hexagon.halfOfHeight*2;
		}
	}
}


var shapes ={
	/**This is used to move map with mouse drag etc.*/
	hexagon:{
		radius:undefined,
		//total width = radius * 2
		halfOfHeight:undefined,
		//total height = halfOfHeight *2
		points:undefined,

		generateHexagon:function (r){
			this.radius=r;
			this.halfOfHeight = this.radius*SQRT_3/2;
			this.points = [-this.radius,0/**/,-this.radius/2,this.halfOfHeight,/**/this.radius/2,this.halfOfHeight,/**/this.radius,0,/**/this.radius/2,-this.halfOfHeight,/**/-this.radius/2,-this.halfOfHeight];
		}
	},
	cross:{
		points:undefined,		
		/**h - half of size of cross (cross is like square with edges cut out)*/
		generateCross:function (h){
			var i = h*1.5;
			this.points=[-i,i/**/,-i,h/**/,i,h/**/,i,i/**/,h,i/**/,h,-i/**/,i,-i/**/,i,-h/**/,-i,-h/**/,-i,-i/**/,-h,-i/**/,-h,i];
		}
	},
	mapX:0,
	mapY:0,
	moveMap:function(relativeX,relativeY){
		this.mapX+=relativeX;
		this.mapY+=relativeY;
	},
}


function PaintingClass(width,height,defaultValue){
	var mapWidth=undefined;
	var mapHeight=undefined;
	var tileMap=undefined;
	var playersTypesMap=undefined;
	var playersCountMap=undefined;
	this.generateMap = function(width,height,defaultValue){
		mapWidth=width;
		mapHeight=height;
		tileMap= new Uint8Array(width*height).fill(0);
		playersCountMap= new Uint8Array(width*height).fill(0);
		playersTypesMap= new Int8Array(width*height).fill(-1);
		tileMap[25]=2;
		playersCountMap[0]=1;
		playersTypesMap[0]=0;
	}
	this.generateMap(width,height,defaultValue);
	this.getW=function(){return mapWidth;}
	this.getH=function(){return mapHeight;}
	this.getMapArea=function(){return mapWidth*mapHeight;}
	function getIndexOfPosition(x,y){
		return mapWidth*y+x;
	}
	this.getInMapByIndex=function(index){
		return tileMap[index];
	}
	this.getInMap=function(x,y){
		return tileMap[mapWidth*y+x];
	}
	this.setInMap=function(x,y,value){
		tileMap[mapWidth*y+x]=value;
	}
	this.getPlayerTypeInMapByIndex=function(index){
		return playersTypesMap[index];
	}
	this.getPlayerTypeInMap=function(x,y){
		return playersTypesMap[mapWidth*y+x];
	}
	// this.setPlayerTypeInMap=function(x,y,type){
	// 	playersTypesMap[mapWidth*y+x]=type;
	// }
	this.getPlayerCountInMap=function(x,y){
		return playersCountMap[mapWidth*y+x];
	}
	// this.setPlayerCountInMap=function(x,y,count){
	// 	var index = mapWidth*y+x;
	// 	playersCountMap[index]=count;
	// 	if(count < 1)playersTypesMap[index]=-1;
	// }
	// this.setPlayerInMap=function(x,y,type,count){
	// 	var index = mapWidth*y+x;
	// 	if(count < 1)type = -1;
	// 	playersCountMap[index]=count;
	// 	playersTypesMap[index]=type;
	// }
	this.increasePlayerInMap=function(x,y,type,countToIncrease)
	{
		return this.increasePlayerInMapByIndex(mapWidth*y+x,type,countToIncrease);
	}
	this.increasePlayerInMapByIndex=function(index,type,countToIncrease){
		if(type == -1){//player cleared
			playersTypesMap[index]=-1;
			playersCountMap[index]=0;
		}else if(playersTypesMap[index] ==type){//player count modified
			countToIncrease=playersCountMap[index]+countToIncrease;
			if(countToIncrease<=0){//count too little, so the same as clearing
				playersTypesMap[index]=-1;
				playersCountMap[index]=0;
			}else{
				playersCountMap[index]=countToIncrease;
			}
		}else{//player type modified
			if(countToIncrease<=0){//count too little, so the same as clearing
				playersTypesMap[index]=-1;
				playersCountMap[index]=0;
			}else{
				playersCountMap[index]=countToIncrease;
				playersTypesMap[index]=type;
			}
		}
	}
	this.isPositionValid = function(x,y){
		return x>=0 && y>=0 && x<mapWidth && y<mapHeight;
	}
	function beginDrawing(){
		c2.beginPath();
		c2.lineWidth = 5;
		c2.strokeStyle = "black";
	}
	function endDrawing(){
		c2.fill();
		c2.stroke();
	}
	function setFontProperties(){
		c2.textAlign = "center";
		c2.font = "50px Arial";
		c2.fillStyle = "black"
	}
	this.repaint=function (){
		//repaint hexagons
		for(var i=0,l=TILE_COLORS.length;i<l;i++){
			beginDrawing();
			c2.fillStyle = TILE_COLORS[i];
			for(var x = 0;x<mapWidth;x++){
				for(var y = 0;y<mapHeight;y++){
					/**Draws only those hexagons that have specified type (i)*/
					if(i==this.getInMap(x,y)){
						rendering.translateToHex(x,y);
						rendering.drawPolygon(shapes.hexagon.points);
					}
				}
			}
			endDrawing();
		}
		//repaint crosses
		for(var i=0,l=PLAYER_COLORS.length;i<l;i++){
			beginDrawing();
			c2.fillStyle = PLAYER_COLORS[i];
			for(var x = 0;x<mapWidth;x++){
				for(var y = 0;y<mapHeight;y++){
					/**Draws only those players that have specified type (i)*/
					if(i==this.getPlayerTypeInMap(x,y)){
						rendering.translateToHex(x,y);
						rendering.drawPolygon(shapes.cross.points);
					}
				}
			}
			endDrawing();
		}
		//repaint numbers on those crosses
		setFontProperties();
		for(var x = 0;x<mapWidth;x++){
			for(var y = 0;y<mapHeight;y++){
				var count = this.getPlayerCountInMap(x,y);
				if(count > 1){
					rendering.translateToHex(x,y);
					c2.fillText(count,rendering.translateX,rendering.translateY);
				}
			}
		}
	}
	var repaintSingleHex = this.repaintSingleHex=function( x,y ){
		//get index
		var index = getIndexOfPosition(x,y);
		//translate
		rendering.translateToHex(x,y);
		//draw hexagon
		beginDrawing();
		c2.fillStyle = TILE_COLORS[tileMap[index]];
		rendering.drawPolygon(shapes.hexagon.points);
		endDrawing();
		var countOfPlayer = playersCountMap[index];
		if(countOfPlayer>0){
			//draw cross
			beginDrawing();
			c2.fillStyle = PLAYER_COLORS[playersTypesMap[index]];
			rendering.drawPolygon(shapes.cross.points);
			endDrawing();
			if(countOfPlayer>1){
				//draw player count
				setFontProperties();
				c2.fillText(countOfPlayer,rendering.translateX,rendering.translateY);
			}
		}
	}
	/**In this method x and y is not position of hexagon in grid but 
	just any pixel on screen.*/
	this.paintSinglePlayer=function(x,y,playerType){
		beginDrawing();
		c2.fillStyle = PLAYER_COLORS[playerType];
		rendering.translateX=x;
		rendering.translateY=y;
		rendering.drawPolygon(shapes.cross.points);
		endDrawing();
	}
	this.isAdjacent=function(x1,y1,x2,y2){
		switch(Math.abs(y1-y2)+Math.abs(x1-x2)){
			case 1:
			return true;
			case 2:
			if(x1!=x2){
				if(x1 & 1){//odd
					return y2>y1;
				}else{//even
					return y2<y1;
				}
			}
			return false;
		}
		return false;
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


var state = {
	shouldRepaintEverything:true,//so that we get one repaint at the start
	shouldClearAll:false
}

var painting;

window.onload = function(){
	painting = new PaintingClass(10,10,0);
	mechanism = new Mechanisms();
	shapes.hexagon.generateHexagon(100);
	shapes.cross.generateCross(40);
};




setInterval(function(){

	if(state.shouldRepaintEverything){
		if(state.shouldClearAll){
			painting.clearAll();
		}
		painting.repaint();
		if(input.isPlayerDragAndDropEnabled){
			painting.paintSinglePlayer(input.mouseX,input.mouseY,TYPE_OF_MYSELF);
		}
		state.shouldRepaintEverything=false;
	}
},10);

