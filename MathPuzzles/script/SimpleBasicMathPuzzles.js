
var elements={
	puzzle:null,
	answer:null,
}


document.addEventListener('DOMContentLoaded', function () {
	elements.puzzle  = document.getElementById("puzzle");
	elements.answer  = document.getElementById("answer");
});

function testAnswer(){

}

function generateNext(){
	alert("next="+elements.answer.value);
}
