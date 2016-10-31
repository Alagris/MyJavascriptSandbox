var elements={
	puzzle:null,
	answer:null,
}
const CONSTANTS={
	MAX_NUM:500,
	MAX_FACTOR_COUNT:5,
	PRIMES:[2,3,5,7,11,13],
	operations:{
		PLUS:"+",
		MINUS:"-",
		MULTIPLY:"\\cdot",
		DIVIDE:"\\over",
		// POWER:"^",
		random:function(){
			var r = Math.random();
			if(r<1/4){
				return this.PLUS;
			}else if(r<2/4){
				return this.MULTIPLY;
			}else if(3/4){
				return this.DIVIDE;
			}else{
				return this.MINUS;
			}
		},
		randomExceptDivision:function(){
			var r = Math.random();
			if(r<1/3){
				return this.PLUS;
			}else if(r<2/3){
				return this.MULTIPLY;
			}else{
				return this.MINUS;
			}
		},
		isPlusMinus:function(operation) {
			return operation==this.PLUS||operation==this.MINUS;
		},
		isMultiplyDivide:function(){
			return operation==this.MULTIPLY||operation==this.DIVIDE;
		},
	},

}; 
function makeMath(){
	var self = this;
	this.root=null;
	this.answer=0;
	this.rand={
		/**between 0 and max (both inclusive)*/
		randomInteger:function(max){
			return Math.floor(Math.random()*max+0.5);
		},
		/**both inclusive*/
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
		randomSqrtPrime:function(argument) {
			//this.randomSqrtInteger(CONSTANTS.PRIMES.length) --> returns values between 1 and CONSTANTS.PRIMES.length
			//this.randomSqrtInteger(CONSTANTS.PRIMES.length)-1 --> returns values between 0 and CONSTANTS.PRIMES.length-1
			//CONSTANTS.PRIMES.length-(this.randomSqrtInteger(CONSTANTS.PRIMES.length)-1) --> between length and 1
			return CONSTANTS.PRIMES[CONSTANTS.PRIMES.length-this.randomSqrtInteger(CONSTANTS.PRIMES.length)];
		},
		randomBoolean:function(threshold){
			return Math.random()<=threshold;
		},
		//returns number between 1 and max
		randomSqrt:function(max){
			return Math.cbrt((1+Math.random()*(max*max*max-1)));
		},
		randomSqrtInteger:function(max){
			return Math.floor(this.randomSqrt(max)+0.5);
		}
	};
	function genNum(v,num){
		return {
			factors:num,
			value:v,
		}
	}
	function generateNumber_(size){
		if(size==0)return [0];
		var num,v=1;
		if(size==1 && self.rand.randomBoolean(1/CONSTANTS.PRIMES.length)){
			num=[1];
		}else{
			num=[];
			while(size-->=1){
				var e=(num[size]=self.rand.randomSqrtPrime());
				if(v*e>=CONSTANTS.MAX_NUM){
					break;
				}else{
					v*=e;
				}
			}
		}
		return genNum(v,num);
	}
	function findFactors(num){
		var val=num.value;
		if(val==0){
			return [0];
		}
		var y=0;
		if(num.factors==undefined){
			num.factors=[];
		}
		for(var x=0;x<CONSTANTS.PRIMES.length;x++){
			while(val%CONSTANTS.PRIMES[x]==0){
				val/=CONSTANTS.PRIMES[x];
				num.factors[y++]=CONSTANTS.PRIMES[x];
			}
		}
		if(num.factors.length==0|| (val!=1 && val!=-1)){
			num.factors[y]=Math.abs(val);
		}
	}
	this.generateNumber=function(maxSize){
		return generateNumber_(maxSize-self.rand.randomSqrtInteger(maxSize)+1);
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
		if(operation==CONSTANTS.operations.DIVIDE&& outputValue.value>=CONSTANTS.MAX_NUM/10){
			operation=CONSTANTS.operations.randomExceptDivision();
		}
		switch(operation){
			case CONSTANTS.operations.PLUS:
			//val1 + val2 = outputValue
			val1=self.generateNumber(CONSTANTS.MAX_FACTOR_COUNT);
			val2=genNum(outputValue.value-val1.value,undefined);
			findFactors(val2);
			if(val2.value<0){
				val2.value=-val2.value;
				operation=CONSTANTS.operations.MINUS;
			}
			break;
			case CONSTANTS.operations.MINUS:
			//val1 - val2 = outputValue
			val1=self.generateNumber(CONSTANTS.MAX_FACTOR_COUNT);
			val2=genNum(val1.value-outputValue.value,undefined);
			findFactors(val2);
			if(val2.value<0){
				val2.value=-val2.value;
				operation=CONSTANTS.operations.PLUS;
			}
			break;
			case CONSTANTS.operations.MULTIPLY:
			//val1 * val2 = outputValue
			//val2 = outputValue / val1
			if(outputValue.value==0){
				val1=genNum(0,[0]);
				val2=self.generateNumber(CONSTANTS.MAX_FACTOR_COUNT);
			}else{
				val1=genNum(1,new Array(self.rand.randomIntegerBetween(1,outputValue.factors.length)));
				val2=genNum(1,new Array(Math.max(1,outputValue.factors.length-val1.factors.length)));
				for(var i=0;i<val1.factors.length;i++){
					val1.value*=(val1.factors[i]=outputValue.factors[i]);
				}
				for(;i<outputValue.factors.length;i++){
					val2.value*=(val2.factors[i-val1.factors.length]=outputValue.factors[i]);
				}
				if(val2.factors[0]==undefined){
					val2.factors[0]=1;
				}
			}

			break;
			case CONSTANTS.operations.DIVIDE:
			//val1 / val2 = outputValue
			//val2 = val1 / outputValue
			if(outputValue.value==0){
				val1=genNum(0,[0]);
				val2=self.generateNumber(CONSTANTS.MAX_FACTOR_COUNT);
			}else{
				val1=outputValue;
				val2=self.generateNumber(2);
				val1.value*=val2.value;
				val1.factors.push.apply(val1.factors,val2.factors);
			}
			break;
			// case math.operation.POWER:
			// 	break;
		}
		
		return manualGenNode(operation,val1,val2);
	};
	this.copyNum=function(num){
		return genNum(num.value,num.factors.slice());
	};
	this.randGenNode=function(outputValue){
		return autoGenNode(CONSTANTS.operations.random(),outputValue);
	};
	this.recursiveNodeTreeGenerator=function(root,maxDepth){
		if(self.rand.randomBoolean(1-1/maxDepth)){
			root.val1=self.randGenNode(root.val1);
			self.recursiveNodeTreeGenerator(root.val1,maxDepth-1);
		}
		if(self.rand.randomBoolean(1-1/maxDepth)){
			root.val2=self.randGenNode(root.val2);
			self.recursiveNodeTreeGenerator(root.val2,maxDepth-1);
		}
	};
};

var math=new makeMath();


document.addEventListener('DOMContentLoaded', function () {
	elements.puzzle  = document.getElementById("puzzle");
	elements.answer  = document.getElementById("answer");
	elements.complexity = document.getElementById("complexity");
	elements.answer.addEventListener('keypress', function (e) {
		var key = e.which || e.keyCode;
    	if (key === 13) { // 13 is enter
    		measure.displayTime();
    	}else if(key===27){
    		generateNext();
    	}
    });
	generateNext();
});


function generateNext(){
	math.root=math.randGenNode(math.copyNum(math.answer=math.generateNumber(CONSTANTS.MAX_FACTOR_COUNT)));
	math.recursiveNodeTreeGenerator(math.root,elements.complexity.value);
	elements.puzzle.innerText="$$ "+debug.printTree(math.root)+" =$$";
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,"puzzle"]);
	MathJax.Hub.Queue(measure.startMeasuringTime);
	console.log("ans="+math.answer.value);
	elements.answer.value="";
}

var measure={
	start:0,
	startMeasuringTime:function (){
		measure.start=performance.now();
	},
	displayTime:function(){
		if(elements.answer.value!=math.answer.value){
			alert("Wrong! Try again.");
		}else{
			var t=Math.floor(performance.now()-measure.start);
			var milis= t%1000;
			t=Math.floor(t/1000);
			var seconds=t%60;
			t=Math.floor(t/60);
			alert("YAY! YOU DID IT! time:\n"+t+" min\n"+seconds+" sec\n"+milis+" mili" );
		}
	},
}

var debug={
	printNode:function(node){
		console.log(node.val1.value+" "+node.op+" "+node.val2.value);
	},
	printMath:function(math){
		console.log("");
	},
	printNum:function(num){
		console.log(num.value+" = ");
		console.log(num.factors);
	},
	printTree:function(root){
		var val1;
		var op1=root.val1.op;
		if(op1==undefined){
			val1=root.val1.value;
		}else{
			val1=debug.printTree(root.val1);
		}
		var val2;
		var op2=root.val2.op;
		if(op2==undefined){
			val2=root.val2.value;
		}else{
			val2=debug.printTree(root.val2);
		}
		switch(root.op){

			case CONSTANTS.operations.DIVIDE:
			var output="{";
			if(op1==CONSTANTS.operations.DIVIDE){
				output+=" ( "+val1+" ) ";
			}else{
				output+=val1;
			}
			output+=" "+root.op+" ";
			if(op2==CONSTANTS.operations.DIVIDE){
				output+=" ( "+val2+" ) ";
			}else{
				output+=val2;
			}
			return output+"}";

			case CONSTANTS.operations.MULTIPLY:
			var output="";
			if(CONSTANTS.operations.isPlusMinus(op1)){
				output+="( "+val1+" )";
			}else{
				output+=val1;
			}
			output+=" "+root.op+" ";
			if(CONSTANTS.operations.isPlusMinus(op2)){
				output+="( "+val2+" )";
			}else{
				output+=val2;
			}
			return output;

			case CONSTANTS.operations.MINUS:
			if(CONSTANTS.operations.isPlusMinus(op2)){
				return val1+" "+root.op+" ( "+val2+" )";
			}else{
				return val1+" "+root.op+" "+val2;
			}

			default:
			return val1+" "+root.op+" "+val2;

		}



	},
}


