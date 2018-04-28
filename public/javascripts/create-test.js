var games = [];
var gen_is_on = false;

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
  	var file_size_span = document.getElementById("file-size");
	
	if (file) {
		if(file.size>1000000){
			preview.src = "/images/logo/default-logo.png";
	  		file_size_span.innerHTML =" *Розмір файлу перевищує 1 мегабайт";
	  	}
	    else{
	    	file_size_span.innerHTML =  "Розмір файлу: " + file.size/1024 + "Kb";
	    	reader.readAsDataURL(file);
	    }
	    file_size_span.style.visibility = "visible";
	}else{
	    preview.src = "/images/logo/default-logo.png";
		file_size_span.style.visibility = "";
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

function showGenerator(){

	var generator = document.getElementById("gen-body");
	var img = document.getElementById("arrow");

	if(gen_is_on){
		generator.style.display = "none";
		img.src = "/images/arrow_bottom.png"
		gen_is_on = false;
	}else{
		generator.style.display = "";
		img.src = "/images/arrow_top.png"
		gen_is_on = true;
	}

}

function createRandomGameList(){
	var size = document.getElementById("games-size").value;
	var elems = document.getElementsByClassName("add_btn");
	games = [];
	elems.forEach = [].forEach;
	elems.forEach(function(elem){
		elem.style.background= "url(/images/plus_white.png";
		elem.style.backgroundRepeat= "no-repeat";
		elem.style.backgroundPosition= "center";
	});

	if(size>elems.length){
		document.getElementById("games-size").value = elems.length;
		elems.forEach(function(elem){
			addGame(elem);
		})
	}else{
		if(size<1){
			size =1;
			document.getElementById("games-size").value = size;
		}
		while(games.length<size){
			var index = Math.floor((Math.random() * elems.length));
			addGame(elems[index]);
		}
	}

	console.log(games);
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
  		location.replace("/admin-page/test-overview/"+response);
  	},
  	error: function(xhr) {
    	console.log("Errror");
  	}
}).done();


}