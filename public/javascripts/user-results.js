var open_indexes = [];
const CLEAR_RES = 1;
const DEL_TEST = 2;
var type;

window.onload = function(){
	document.getElementById("edit-btn").addEventListener("click", displayEditor);
	document.getElementById("close-editor-btn").addEventListener("click", closeEditor);
	document.getElementById("save-btn").addEventListener("click", changeTest);
	document.getElementById("checkBox").addEventListener("click", postChanges);
	document.getElementById("new-name").addEventListener("keypress", keyPress);
	document.getElementById("clear-btn").addEventListener("click", function(){
		askPermission(CLEAR_RES);
	});
	document.getElementById("delete-btn").addEventListener("click", function(){
		askPermission(DEL_TEST);
	});

	document.getElementById("yes-btn").addEventListener("click", acceptChanges);
	document.getElementById("no-btn").addEventListener("click", dontAcceptChanges);

}

function showDetail(elem){
	var next_row = $(elem).closest('tr').next('tr')[0];
	var next_index = $(elem).index()+1;


	console.log(next_index);

	if(!is_on(next_index)){
		next_row.style.display="";
		elem.style.borderBottom="none";
		open_indexes.push(next_index);
		console.log(open_indexes);
	}else{
		next_row.style.display="none";
		elem.style.borderBottom="";
		var index = open_indexes.indexOf(next_index);
		if (index > -1) {
		    open_indexes.splice(index, 1);
		}
	}

}

function is_on(index){
	if(!open_indexes.length){
		return false;
	}else{
		if(open_indexes.indexOf(index) == -1) return false;
		else return true;
	}
}

function sortResults(value){
	console.log(value);

	$.ajax({
  		url: "/sort_res",
  		type: "get", 
  		data: {condition: value, id: document.location.href},
  		success: function(response) {
  			window.location.replace(response);
  		},
  		error: function(xhr) {
    		console.log("Errror");
  		}
	}).done();

}

function loadUserInfo(id){
	window.event.cancelBubble = true;
	console.log(id);


	$.ajax({
  		url: "/getUser",
		type: "get", //send it through get method
		data: { id: id },
		success: function(response) {
	  		displayUser(response);
	  	},
		error: function(xhr) {
	    	//Do Something to handle error
	  	}
	}).done();
}


function displayUser(user){
	document.getElementById("cover-div").style.display="";;
	document.getElementById("user-role").innerHTML = (user.admin) ? "Адміністратор": "Користувач";
	document.getElementById("user-name").innerHTML = user.firstname + " " + user.lastname;
	var email = document.getElementById("user-email");
	email.innerHTML = user.email;

	

	var test_name = document.getElementById("test-name").innerHTML;

	email.href = "https://mail.google.com/mail/?view=cm&fs=1&to=" + user.email +
				"&su=" + test_name;
}

function closeUserInfo(){
	
	document.getElementById("cover-div").style.display="none";
}

function displayDeleteMennu(){
	
}

function displayEditor(){
	document.getElementById("display-name").style.display= "none";
	document.getElementById("edit-name").style.display = "";
	
}

function closeEditor(){
	document.getElementById("display-name").style.display= "";
	document.getElementById("edit-name").style.display = "none";
	document.getElementById("new-name").value = "";
}


function keyPress(event){
	if(event.keyCode == 13 ){
		changeTest();
	}
}

function changeTest(){

	var name_input =  document.getElementById("new-name");
	var new_name = name_input.value;

	if(new_name.length > 0){
		document.getElementById("test-name").innerHTML = new_name;
		closeEditor();
		postChanges();
	}else{
		name_input.style.border="2px solid red";
		setTimeout(function(){
			name_input.style.border="";
		},500);
	}
}


function askPermission(tp){
	type = tp;
	var message = document.getElementById("accept-message");
	document.getElementById("accept-block").style.display ="";

	switch(type){
		case CLEAR_RES:
			message.innerHTML = "Очистити результати ?";
			break;
		case DEL_TEST:
			message.innerHTML = "Видалити тестування ?";
			break;
		default: return;
	}
}


function dontAcceptChanges(){
	type = null;
	document.getElementById("accept-block").style.display ="none";
}


function acceptChanges(){
	switch(type){
		case CLEAR_RES:
			clearResults();
			break;
		case DEL_TEST:
			deleteTest();
			break;
		default: return;
	}
}


function clearResults(){


	$.ajax({
	  url: "/clearResults",
	  type: "post", //send it through get method
	  data: {
	  	id: document.location.href,
	  },
	  	success: function(response) {
	  		location.reload();
	  	},
	  	error: function(xhr) {
	    	console.log("Errror");
	  	}
	}).done();

}


function deleteTest(){
	$.ajax({
	  url: "/deleteTest",
	  type: "post", //send it through get method
	  data: {
	  	id: document.location.href,
	  },
	  	success: function(response) {
	  		location.replace(response);
	  	},
	  	error: function(xhr) {
	    	console.log("Errror");
	  	}
	}).done
}


function postChanges(){

	var new_name = document.getElementById("test-name").innerHTML;
	var active = document.getElementById("checkBox").checked;


	$.ajax({
	  url: "/updateTest",
	  type: "post", //send it through get method
	  data: {
	  	id: document.location.href,
	  	active: active,
	  	name: new_name
	  },
	  	success: function(response) {
	  		console.log("YES");
	  	},
	  	error: function(xhr) {
	    	console.log("Errror");
	  	}
	}).done();
}