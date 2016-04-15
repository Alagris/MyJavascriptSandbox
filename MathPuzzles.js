const MAX_NUMBER = 200;
const MEDIUM_NUMBER=MAX_NUMBER/2;
const MIN_NUMBER = -MAX_NUMBER;
const MEDIUM_MIN_NUMBER = MIN_NUMBER/2;
//MAX_NUMBER > MEDIUM_NUMBER > 0 > MEDIUM_MIN_NUMBER > MIN_NUMBER
function part(number,multipliedBy,added,_power,_isVariable){
	//the part looks as follows:
	// (number^_power)*multipliedBy + added
	//multipliedBy,added,and _power could be other parts
	return{
		isVariable:_isVariable,//if true then thisNumber is just index of variable, not the actual number
		thisNumber:number,
		times:multipliedBy,
		plus:added,
		power:_power;
	}
}
function partRealNumber(number){
	return part(number,1,0,1,false);
}

var math = {
	function randomWhole(max){
		return Math.ceil(Math.random()*max);
	}
	function randomWholeBetween(min,max){
		return min+randomWhole(max);
	}
	function randomWholeBetweenExcept(min,max,exception){
		var tmp=randomWholeBetween(min,max);
		while(tmp==exception){
			tmp=randomWholeBetween(min,max);
		}
		return tmp;
	}
	function generateFalseEquation(variableIndex){
		/*
		a*x^2 + b*x + c = 0
		b^2 < 4*a*c
		if a>0
		then b^2/4/a < c
		if a<0
		then b^2/4/a > c
		*/
		var whole = part(variableIndex,/*a=*/randomWholeBetweenExcept(MEDIUM_MIN_NUMBER,MEDIUM_NUMBER,0),undefined,2,true);
		//whole = a*x^2
		whole.plus = part(variableIndex,/*b=*/randomWholeBetween(MEDIUM_MIN_NUMBER,MEDIUM_NUMBER),undefined,1,true);
		//whole.plus = b*x
		if(whole.times>0){
			whole.plus.plus = /*c=*/randomWholeBetween(whole.plus.times*whole.plus.times/whole.times/4,MEDIUM_NUMBER );
		}else{
			whole.plus.plus = /*c=*/randomWholeBetween(MEDIUM_MIN_NUMBER,whole.plus.times*whole.plus.times/whole.times/4);
		}
		return whole;
	}
	function generateTrueEquation(variableIndex){
		return part(variableIndex,randomWhole(MAX_NUMBER),randomWhole(MAX_NUMBER),1,true);
	}
	this.generateEquation = function(countOfTrueParts,countOfFalseParts){
		var equationPart;
		if(countOfTrueParts>0){
			equationPart = generateTrueEquation(0);
			countOfTrueParts--;
		}
		while(countOfTrueParts>0){
			equationPart
		}
		
	}

}
