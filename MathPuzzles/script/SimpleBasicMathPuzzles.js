// answer=a
// a=a
// a=+c,b
// a=+*d,e,b
// a=+*d,e,/f,g
// 
// 
// 
// 
// 
// 
// 
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var elements={
	puzzle:null,
	answer:null,
}
const var CONSTANTS={
	PRIMES:[2,3,5,7,11,13],
	operations:{
		PLUS:"+",
		MINUS:"-",
		MULTIPLY:"*",
		DIVIDE:"/",
		// POWER:"^",
		random:function(){
			var r = Math.random()*4;
			if(r<1/4){
				return PLUS;
			}else if(r<2/4){
				return MULTIPLY;
			}else if(3/4){
				return DIVIDE;
			}else{
				return MINUS;
			}
		}
	},

}; 
function makeMath(){
	this.root=null;
	this.answer=0;
	this.rand={
		randomInteger:function(max){
			return Math.floor(Math.random()*max+0.5);
		},
		randomIntegerBetween:function(min,max){
			return min+this.randomInteger(max-min);
		},
		randomBetween:function(min,max){
			if(min>max){
				return max+Math.random()*(min-max);
			}else{
				return min+Math.random()*(max-min);
			}
		},
		randomPrime:function(){
			return CONSTANTS.PRIMES[this.randomInteger(CONSTANTS.PRIMES.length-1)];
		},
		randomBoolean:function(threshold){
			return Math.random()<=threshold;
		},
		randomSqrt:function(max){
			return Math.sqrt(Math.random()*max);
		},
	};
	this.generateNumber=function(size){
		if(size==0)return [0];
		var num;
		if(size==1 && rand.randomBoolean(1/CONSTANTS.PRIMES.length)){
			num=[1];
		}else{
			num=new Array(size);
			while(size-->1){
				num[size]=rand.randomPrime();
			}
		}
		return num;
	}
	function manualGenNode(operation,value1,value2){
		return {
			op:operation,
			val1:value1,
			val2:value2,
		};
	};
	function autoGenNode(operation,outputValue){
		var val1,val2;
		val1=this.generateNumber();
		switch(operation){
			case math.operation.ADD:
			this.randomIntegerBetween(outputValue-this.MIN,outputValue-this.MAX);
			outputValue-=shift;
			break;
			case math.operation.MULTIPLY:
			if(outputValue==0){
				shift=this.randomIntegerBetween(this.MIN,this.MAX);
			}else{
				shift=this.randomBetween(outputValue/this.MAX,outputValue/this.MIN);
				outputValue/=shift;
			}
			break;
			case math.operation.DIVIDE:
			if(outputValue==0){
				shift=this.randomIntegerBetween(this.MIN,this.MAX);
			}else{
				shift=this.randomBetween(this.MAX/outputValue,this.MIN/outputValue);
				outputValue*=shift;
			}
			break;
			// case math.operation.POWER:
			// 	break;
		}
		return manualGenNode(operation,outputValue,shift);
	};
	this.randGenNode=function(outputValue){
		return autoGenNode(operations.random(),outputValue);
	};
};

var math=new makeMath();


document.addEventListener('DOMContentLoaded', function () {
	elements.puzzle  = document.getElementById("puzzle");
	elements.answer  = document.getElementById("answer");
});

function testAnswer(){
	if(elements.answer.value==math.answer){
		alert("correct!");
	}else{
		alert("incorrect... try again");
	}
}

function generateNext(){
	alert("next=");
}



