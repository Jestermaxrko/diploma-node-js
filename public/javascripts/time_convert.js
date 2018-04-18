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