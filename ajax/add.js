
let form_text = "";
function set_up_var() {
	form_text = document.getElementById("data").innerHTML;
}

function add_mode() {
	document.getElementById("data").innerHTML = form_text;
}

function show_mode() {
	let url = "../cgi-bin/zad7.py";
    let request = getRequestObject();
    request.onreadystatechange = function() {
    	if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
			document.getElementById("data").innerHTML = request.responseText;    		
    	}
    };
    request.open("GET", url, true);
    request.send(null);
}


function getRequestObject(){
    if ( window.ActiveXObject)  {
        return ( new ActiveXObject("Microsoft.XMLHTTP")) ;
    } else if (window.XMLHttpRequest)  {
        return (new XMLHttpRequest());
    } else {
        return (null) ;
    }
}

function handleResponse(rq){
    if (rq.readyState == 4) {
        alert(request.responseText);
    }
}

function add_handle(event){
    event.preventDefault();
    const elements = document.querySelectorAll(".inp_txt"); 
    let url = "../cgi-bin/zad7_add.py?title=" + elements[0].value + "&author=" + elements[1].value;
    let request = getRequestObject();
    request.onreadystatechange = handleResponse(request);
    request.open("GET", url, true);
    request.send(null);
}