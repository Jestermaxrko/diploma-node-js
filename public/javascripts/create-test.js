var games = [];

function addTag(tag){
	var text_area = document.getElementById("desc");
	var text = text_area.value;
	var sel_start = text_area.selectionStart;
	var sel_end = text_area.selectionEnd;	

	if(sel_start || sel_end){
			
		if(text_area.selectionStart!=text_area.selectionEnd){
			var sel = text_area.value.substring(sel_start, sel_end);
			text = text.replace(sel,"<"+tag+">"+sel+"</"+tag+">");
			text_area.value = text;
		}else{
			console.log("yes");
			if(text_area.selectionEnd!=0){
				if(sel_end==text_area.value.length){
					text_area.value = text+ "<"+tag+"></"+tag+">";
				}else{

					text_area.value= text_area.value.substr(0, sel_end) + "<"+tag+"></"+tag+">" + text_area.value.substr(sel_end);

				}
			}else{
				console.log("SSSSSSS");
			}
		}
	}else{
		text_area.value = "<"+tag+"></"+tag+">"+text;
	}

	loadDescription(text_area.value);
}


function loadDescription(text){

	if(text.length)
		document.getElementById("description").innerHTML =text;
	else
		document.getElementById("description").innerHTML ="<Опис>";
}

function loadTittle(text){
	if(text.length)
		document.getElementById("field-title").innerHTML  = text;
	else
		document.getElementById("field-title").innerHTML ="<Назва>";
}

function loadImage() {
  var preview = document.getElementById('test-logo');
  var file    = document.getElementById('file-logo').files[0];
  var reader  = new FileReader();

  reader.onloadend = function () {
    preview.src = reader.result;
  }

	if (file) {
		if(file.size>100000000000000){
	  		alert("FALSSEE");
	  	}
	    else{
	    	reader.readAsDataURL(file);
	    }
	    
	}else{
	    preview.src = "/images/logo/default-logo.png";
	}
}


function showCondition(elem){
	var to_show = elem.parentElement.parentElement;
	var desc_elem  =  to_show.getElementsByClassName("game-desc")[0];

	if(desc_elem.classList.contains('opened')){
		desc_elem.style.display="none";
		desc_elem.classList.remove("opened");
	}else{
		desc_elem.style.display="";
		desc_elem.classList.add("opened");
	}
}

function addGame(elem){

	var game_id= elem.id;
	if(games.indexOf(game_id)==-1){
		games.push(game_id);
		elem.style.background= "url(/images/yes_white.png";
		elem.style.backgroundRepeat= "no-repeat";
		elem.style.backgroundPosition= "center";
		
	}else{
		
		games.splice(games.indexOf(game_id),1);
		elem.style.background="";
	}

	document.getElementById("game-lbl").innerHTML = "Ігри (" + games.length +")";
}

function saveTest(){

	var name = document.getElementById("test-name").value;
	var desc = document.getElementById("desc").value;

	if(name && desc){

		if(!games.length){
			var error_span = document.getElementById("error-text");
			error_span.innerHTML = "*Ви не вибрали жодного завдання";
			error_span.style.display="";
		}else{
			
			postTest(name, desc);

		}

	}else{
		var error_span = document.getElementById("error-text");
			error_span.innerHTML = "*Заповніть усі поля";
			error_span.style.display="";
	}

}


function postTest(name, desc){

	var img;
	var dataURL;
	if( document.getElementById("file-logo").files.length){
		img  = document.getElementById("file-logo").files[0].name ;
		dataURL = document.getElementById("test-logo").src;
		console.log(dataURL);
	}else{
		img = "default-logo.png";
	}

	var games_to_push = [];

	games.forEach(function(item){
		var game = {};
		game.game = item.replace(" ","");
		games_to_push.push(game);
	});

	console.log(games_to_push);

	console.log(img);
	$.ajax({
  url: "/postTest",
  type: "post", //send it through get method
  data: {
  	name: name,
  	desc: desc,
  	img: img,
  	games: JSON.stringify(games_to_push),
  	imgBase64: dataURL
  },
  	success: function(response) {
  		console.log("YES");
  	},
  	error: function(xhr) {
    	console.log("Errror");
  	}
}).done();


}