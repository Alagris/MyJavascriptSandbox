////////////////////////////////
////////////////////////////////Math.random()
////////////////////////////////
//0 exclusive, max inclusive
function randomInteger(max){
	return Math.ceil(Math.random()*max);
}
//min exclusive, max inclusive
function randomIntegerBetween(min,max){
	return min+randomInteger(max);
}
var arr=new Array(10);
for(var x=0;x<10;x++){
	arr[x]=0;
}
for(x=1;x<1000;x++){
	arr[randomIntegerBetween(0,10)]++;
}
for( x=0;x<10;x++){
	console.log(arr[x]);
}
//outputs
// 0
// 92
// 108
// 105
// 96
// 100
// 94
// 98
// 94