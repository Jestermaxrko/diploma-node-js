//var console = { log: function() {} };
var current_games = [];
var current_game_index = -1;
var current_li_index = 0;
var test_time = 0;
var timer;
var results =[];
var full_results = {};


window.onload = function(){

$.ajax({
  url: "/getCurrentTest",
  type: "get", //send it through get method
  data: { id:document.location.href },
  success: function(response) {

  	if(response){
  		current_games = response.games;
      	createGamesPanel();
    }else{
    	window.location.href = "/";
    }
  },
  error: function(xhr) {
    //Do Something to handle error
  }
}).done();

}

function createGamesPanel(){

	console.log(current_games);
	var games_list = document.getElementById("games-list");

	var first_li = document.createElement("LI");
	first_li.className = "static-li active-li li-item";
	first_li.innerHTML = "Правила";
	games_list.appendChild(first_li);

	for(var i = 0; i < current_games.length; i++){
		var li = document.createElement("LI");
		li.className = "li-item";
		li.innerHTML = current_games[i].game.name;
		games_list.appendChild(li);
	}
	
	var last_li = document.createElement("LI");
	last_li.className = "static-li li-item";
	last_li.innerHTML = "Результати";
	games_list.appendChild(last_li);

}

function startTest(){

	var all_li = document.getElementById("games-list").getElementsByTagName("li");
	all_li[current_game_index + 1].classList.remove("active-li");
	current_game_index++;
	all_li[current_game_index + 1].classList.add("active-li");
	timer = setInterval(
		function() { test_time++;
			document.getElementById("timer-time").innerHTML = getTimeString(test_time);
		}
	, 1000);

	document.getElementById("task-page").style.display="";
	document.getElementById("start-page").style.display="none";
	loadGame();
	
}

function nextGame(answer,tries){

	if(current_game_index<current_games.length){
		var all_li = document.getElementById("games-list").getElementsByTagName("li");
		all_li[current_game_index + 1].classList.remove("active-li");
		
		var this_game_time = 0;

		if(results.length == 0){
			this_game_time = test_time;
		}else{
			this_game_time = test_time - results[current_game_index - 1].time;
		}

		var this_game_res = {
			name: current_games[current_game_index].game.name,
			time: this_game_time,
			tries: -tries,
			answer: -answer
		}

		console.log(this_game_res);

		results.push(this_game_res);
		current_game_index++;
		all_li[current_game_index + 1].classList.add("active-li");
		


		if(current_game_index >= current_games.length){
			clearInterval(timer);
			var to_delete = document.getElementById("task-location");
			to_delete.parentNode.removeChild(to_delete);
			document.body.innerHTML="";
			loadResults();
			console.log("load results");
		}else{
			loadGame();
		}
	}
}


function recieveTaskResult(answer, tries){
	nextGame(-answer,-tries);
}



function loadResults(){

	var sum_tries=0;
	var sum_right_answers = 0;

	for(var i=0;i<results.length;i++){
		sum_tries+=results[i].tries;
		if(results[i].answer==true)
			sum_right_answers++;
	}

	full_results = {
		games: results,
		points: sum_right_answers,
		tries: sum_tries,
		time: test_time,
	}
	
	postResults();
}


//-----------------HELPERS-----------------------//

function getTimeString(value){
	var hours   = checkTime(Math.floor(value / 3600) % 24)
    var minutes = checkTime(Math.floor(value / 60) % 60)
    var seconds = checkTime(value % 60)   
    return hours+":"+minutes+":"+seconds;
}

function checkTime(value){
	if(value<10) value="0"+value;
	return value;
}

//------------------AJAX------------------------///

function postResults(){

var res_str = JSON.stringify(full_results);

	$.ajax({
  url: "/postResult",
  type: "post", //send it through get method
  data: {result: res_str, id: document.location.href},
  success: function(response) {
  	window.location.replace(response);
  },
  error: function(xhr) {
    console.log("Errror");
  }
}).done();

}


function loadGame(){

	$.ajax({
  url: "/getGame",
  type: "get", //send it through get method
  data: { link:current_games[current_game_index].game.link },
  success: function(response) {

  	var div = document.createElement("div");
  	var script_div = document.getElementById("inner-scripts");
  	var task_location = document.getElementById("task-location"); 
  	var link = document.createElement("link");
  	script_div.innerHTML ="";
  	task_location.innerHTML ="";
  	link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = "/stylesheets/games/"+current_games[current_game_index].game.link+".css"
    link.media = 'all';
    script_div.appendChild(link);
  	script_div.appendChild(document.createElement('script')).src = '/javascripts/games/'+current_games[current_game_index].game.link+'.js';
  	div.innerHTML = response;

  	document.getElementById("task-location").style.opacity ="0";
  	setTimeout(function(){
  		document.getElementById("task-location").style.opacity ="1";
  	},50)



  	document.getElementById("task-location").appendChild(div);



  },
  error: function(xhr) {
    //Do Something to handle error
  }
}).done();

}
