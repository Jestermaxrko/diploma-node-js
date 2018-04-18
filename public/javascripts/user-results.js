var open_indexes = [];

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