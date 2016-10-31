const MAX_NUMBER = 200;
const MEDIUM_NUMBER=MAX_NUMBER/2;
const MIN_NUMBER = -MAX_NUMBER;
const MEDIUM_MIN_NUMBER = MIN_NUMBER/2;
//MAX_NUMBER > MEDIUM_NUMBER > 0 > MEDIUM_MIN_NUMBER > MIN_NUMBER
var puzzleBoard = document.getElementById('puzzle');
var OPERATIONS={
	PLUS:'+',
	MINUS:'-',
	TIMES:"\\cdot",//latex
	OVER:"\\over",//latex
	random:function(){
		var r=Math.random();
		if(r<0.25){
			return PLUS;
		}else if(r<0.5){
			return MINUS;
		}else if(r<0.75){
			return TIMES;
		}else{
			return OVER;
		}
	},
	isMultiplication:function(operation){
		if(operation===OPERATIONS.PLUS || operation===OPERATIONS.MINUS)return false;
		return true;
	},
	isAddition:function(operation){
		if(operation===OPERATIONS.PLUS || operation===OPERATIONS.MINUS)return true;
		return false;
	}
	getOpposite:function(operation){
		switch(operation){
			case OPERATIONS.PLUS:
				return OPERATIONS.MINUS;
			case OPERATIONS.MINUS:
				return OPERATIONS.PLUS;
			case OPERATIONS.TIMES:
				return OPERATIONS.OVER;
			case OPERATIONS.OVER:
				return OPERATIONS.TIMES;
		}
	}
};

function Part(f,o,s){
	this.firstOperation=f;
	this.originalNumber=o;
	this.shiftNumber=s;
}
var p0 = new Part(OPERATIONS.PLUS,8,new Part(OPERATIONS.TIMES,new Part(OPERATIONS.PLUS,3,1),new Part(OPERATIONS.MINUS,5,1)));

function stringifyPart(part){
	var string ="";
	if(part.originalNumber instanceof Part){
		string = stringifyPart(part.originalNumber);
		if(OPERATIONS.isMultiplication(part) && OPERATIONS.isAddition(part.originalNumber)){
			string = " ( "+string+" ) ";
		}
	}else{
		if(part.shiftNumber instanceof Part){
		}else{
			
		}
		
	}
	if(part.shiftNumber instanceof Part){
		string += stringifyPart(part.shiftNumber);
		if(OPERATIONS.isMultiplication(part) && OPERATIONS.isAddition(part.originalNumber)){
			string = " ( "+string+" ) ";
		}
	}
}
console.log(puzzleBoard);
puzzleBoard.innerHTML="hi";


var math = {
	randomWhole:function(max){
		return Math.ceil(Math.random()*max);
	},
	randomWholeBetween:function (min,max){
		return min+randomWhole(max);
	},
	randomWholeBetweenExcept:function (min,max,exception){
		var tmp=randomWholeBetween(min,max);
		while(tmp==exception){
			tmp=randomWholeBetween(min,max);
		}
		return tmp;
	}
	

};
