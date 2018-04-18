
var tries = 0;
function checkAnswer(){

	var answer = document.getElementById("answer").value;
	if(answer){
		tries++;
		document.getElementById("try").innerHTML="Спроби : "+tries;

		if(answer==parseInt("10011",2)){
			recieveTaskResult(true,tries);
		}
		else{
			
			var elem = document.getElementById("mistery_cell");
			elem.style.backgroundColor="rgba(255,0,0,.2)";

			setTimeout(function(){
				elem.style.backgroundColor="";
			},1000);
		}
	}else{
			var elem = document.getElementById("answer");
			elem.style.borderBottom="2px solid rgba(255,0,0,0.3)";
			setTimeout(function(){
				elem.style.borderBottom="";
			},1000);
	}
}


function passQuestion(){
	recieveTaskResult(false,tries);
}