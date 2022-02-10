var request;
var objJSON;
var id_mongo;

// document.addEventListener('DOMContentLoaded', function() {
// 	ankieta_form();
// }, false);

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers

var DBDeleteRequest = indexedDB.deleteDatabase("LocalDB");
var open = indexedDB.open("LocalDB", 3);

open.onupgradeneeded = function () {
   open.onsuccess = function () {
        db = open.result;
        console.log("Powodzenie");
   }

   open.onerror = function () {
        db = open.result;
        console.log("Błąd");
   }

	db = open.result;
	var objectStore = db.createObjectStore("ankieta", { keyPath: "id", autoIncrement: true });
	objectStore.createIndex("pyt1", "pyt1");
   objectStore.createIndex("pyt2", "pyt2");
   objectStore.createIndex("pyt3", "pyt3");
   objectStore.createIndex("pyt4", "pyt4");
   // objectStore.createIndex("pyt5", "pyt5");
   // objectStore.createIndex("pyt6", "pyt6");
   // objectStore.createIndex("pyt7", "pyt7");
}

function getRequestObject()      {
   if ( window.ActiveXObject)  {
      return ( new ActiveXObject("Microsoft.XMLHTTP")) ;
   } else if (window.XMLHttpRequest)  {
      return (new XMLHttpRequest())  ;
   } else {
      return (null) ;
   }
}

function doNotShowChart() {
   var x = document.getElementsByClassName("chart");
   var i;
   for (i = 0; i < x.length; i++) {
      x[i].style.display = 'none';
   }
}

function isLoged() {
   if (getSessionID() != '') {
      document.getElementById("signin").style.display = "none";
      document.getElementById("signup").style.display = "none";
      document.getElementById("answerOff").style.display = "none";
      document.getElementById("list").style.display = "inline";
      document.getElementById("delete").style.display = "inline";
      // document.getElementById("upgrade").style.display = "none";
      // document.getElementById("find").style.display = "inline";
      document.getElementById("send").style.display = "inline";
      document.getElementById("answer").style.display = "inline";
      document.getElementById("get").style.display = "inline";
      document.getElementById("logout").style.display = "inline";
   }
   else {
      document.getElementById("signin").style.display = "inline";
      document.getElementById("signup").style.display = "inline";
      document.getElementById("answerOff").style.display = "inline";
      document.getElementById("list").style.display = "none";
      document.getElementById("delete").style.display = "none";
      // document.getElementById("upgrade").style.display = "none";
      // document.getElementById("find").style.display = "none";
      document.getElementById("send").style.display = "none";
      document.getElementById("answer").style.display = "none";
      document.getElementById("get").style.display = "none";
      document.getElementById("logout").style.display = "none";
      doNotShowChart();
   }
}

function notes() {
   doNotShowChart();
   window.location.href = 'index.html';
}

// Lista rekordow w bazie
function _list() {
   doNotShowChart();
   document.getElementById('result').innerHTML = '';
   document.getElementById('data').innerHTML = '';  
   request = getRequestObject() ;
   request.onreadystatechange = function() {
      if (request.readyState == 4)    {
         objJSON = JSON.parse(request.response);
         var txt = "";
         for ( var id in objJSON )  {
             txt +=  id+": {" ;
             for ( var prop in objJSON[id] ) {             
                 if ( prop !== '_id')
                   { txt += prop+":"+objJSON[id][prop]+",";  }
                 else
                   { txt += "id:" + objJSON[id][prop]['$oid']+"," ; }
             }
             txt +="}<br/>";
         }
         document.getElementById('result').innerHTML = txt;
      }
   }
   request.open("GET", "http://pascal.fis.agh.edu.pl/~9zaczyk/project2/rest/list", true);
   request.send(null);
}

// rejestrowanie
function reg_form() {
   var form = "<div id='register'><form name='add'>";
   form += "<h1 class='form__title'>Create Account</h1>";
   form    += "<div class='form__input-group'>Podaj login:<input class='form__input' type = 'text' name = 'nazwa' placeholder = 'login' required ><br></div>";
   form    +="<div class='form__input-group'>Podaj hasło:<input class='form__input' type = 'password' name = 'haslo' placeholder = 'hasło' required><br></div>";
   form    += "<input class='form__button' type='button' value='Zarejestruj' onclick='_register(this.form)'>";
   form +=
    "<p class='form__text'><a style='color: black' id='a1' onclick='login_form()'>Masz już konto? Zaloguj się</a></p>";
   form += "</form></div>";
   document.getElementById('data').innerHTML = form;
   document.getElementById('result').innerHTML = '';
}

function _register(form) {
   if (form.nazwa.value == "" || form.haslo.value == "") {
      alert("Wprowadź dane.");
      return;
   }
   var user = {};
   user.username = form.nazwa.value;
   user.password = form.haslo.value;
   txt = JSON.stringify(user);
   document.getElementById('result').innerHTML = '';
   document.getElementById('data').innerHTML = '';  
   request = getRequestObject() ;
   request.onreadystatechange = function () {
   if (request.readyState == 4 && request.status == 200) {
      objJSON = JSON.parse(request.response);
      if (objJSON["status"] == "ok") {
         alert("Zarejestrowano pomyślnie!");
      } else {
         alert("Wprowadzony login już istnieje.");
      }
    }
  };
   request.open("POST", "http://pascal.fis.agh.edu.pl/~9zaczyk/project2/rest/register", true);
   request.send(txt);
}

//logowanie
function login_form() {
   var form = "<div id='login'><form name='add'>";
   form += "<h1 class='form__title'>Login</h1>";
   form +=
      "<div class='form__input-group'>Podaj login<input class='form__input' type = 'text' name = 'nazwa' placeholder = 'login' required ><br></div>";
   form +=
      "<div class='form__input-group'> Podaj hasło<input class='form__input' type = 'password' name = 'haslo' placeholder = 'hasło' required><br></div>";
   form +=
      "<input class='form__button' type='button' value='Zaloguj' onclick='log_user(this.form)'>";
   form +=
      "<p class='form__text'><a style='color: black' id='a2' onclick='reg_form()'>Nie masz konta? Stwórz je</a></p>";
   form += "</form></div>";
   document.getElementById('data').innerHTML = form;
   document.getElementById('result').innerHTML = '';
}

function log_user(form) {
   if (form.nazwa.value == "" || form.haslo.value == "") {
      alert("Wprowadź dane.");
      return;
   }
   var user = {};
   user.username = form.nazwa.value;
   user.password = form.haslo.value;
   txt = JSON.stringify(user);
   document.getElementById('result').innerHTML = '';
   document.getElementById('data').innerHTML = '';  
   request = getRequestObject();
   request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
         objJSON = JSON.parse(request.response);
         if (objJSON["status"] == "ok") {
            alert("zalogowano");
            setSessionID(objJSON['sessionID']);
            isLoged();
            // send_data();
         } else alert("Podano błędne dane. Logowanie nieudane");
      }
   };
   request.open("POST", "http://pascal.fis.agh.edu.pl/~9zaczyk/project2/rest/login", true);
   request.send(txt);
}

//tylko dla zalogowanych uzytkownikow
function read() {
   if (getSessionID() != '') {
      document.getElementById("readMore").style.display = "none";
      var form = 'własnej wartości - nasza tożsamość jest atakowana przez nieprzerwany strumień komunikatów mówiących nam, jak mamy wyglądać, jak się czuć i do czego dążyć. Przez co czujemy się niewystarczający';
      form += '<div id="breakInText"></div>';
      form += '<strong>Syndrom oddzielenia</strong>';
      form += ': bezmyślna aktywność, samotność, przewlekłe stany zapalne, natychmiastowa nagroda, narcyzm, niekorzystne relacje, przewlekły stres, impulsywność.';
      form += '<div id="breakInText"></div>';
      form += '<h3>Detoks mózgu:</h3>';
      form += '<ol>';
      form += '<li>Ogranicz cyfrowe życie (zasada T.I.M.E)</li>';
      form += '<li>Empatia (3-5 min dziennie praktyka empatii)</li>';
      form += '<li>Kontakt z naturą (30 min tygodniowo)</li>';
      form += '<li>Dieta </li>';
      form += '<li>Sen (przynajmniej 7h dziennie) </li>';
      form += '<li>Ćwiczenia fizyczne (30 min dziennie)</li>';
      form += '<li>Medytacja (12 min dziennie)</li>';
      form += '<li>Silne więzi ( 10 min dziennie na kontakty osobiste)</li>';
      form += '</ol>';
      form += '<div id="breakInText"></div>';
      form += 'Masz pytania? Odwiedź stronę autorów książki:';
      form += '<a href="https://www.drperlmutter.com/books/brain-wash/" target="_blank">Strona autorów</a> <br />';
      document.getElementById('result').innerHTML = form;
   }
   else{
      alert("Tylko dla zalogowanych uzytkownikow");
   }
}

//wylogowanie
function log_out() {
   doNotShowChart();
   var cookies = {};
   var session_id = getSessionID();
   cookies.sessionID = session_id;
   txt = JSON.stringify(cookies);
   document.getElementById('result').innerHTML = '';
   document.getElementById('data').innerHTML = '';  
   request = getRequestObject();
   request.onreadystatechange = function () {
      console.log(request.readyState, request.status)
      if (request.readyState == 4 && request.status == 200) {
          console.log(request.response)
          var objJSON = JSON.parse(request.response);
           console.log(objJSON)
         if (objJSON['status'] == 'ok') {
            setSessionID('');
            alert("Pomyślnie wylogowano!");
            isLoged();
            send_data();
         }
         else {
            alert("Nie zalogowany");
         }
      } 
   }
   request.open("POST", "http://pascal.fis.agh.edu.pl/~9zaczyk/project2/rest/logout", true);
   request.send(txt);
}

// Usuwanie rekordow z bazy danych
function _del_list() {
   doNotShowChart();
    document.getElementById('result').innerHTML = '';
    document.getElementById('data').innerHTML = '';  
    request = getRequestObject() ;
    request.onreadystatechange = function() {
       if (request.readyState == 4) {
          objJSON = JSON.parse(request.response);
          var txt = "<form name='data'><select name='del' size='10'>";
          for ( var id in objJSON ) {
              txt +=  "<option value="+id+" >"+id+": {" ;
              for ( var prop in objJSON[id] ) {             
                 if ( prop !== '_id')
                   { txt += prop+":"+objJSON[id][prop]+",";  }
                 else
                   { txt += "id:"+ objJSON[id][prop]['$oid']+"," ;  }
              }     
              txt +="}</option>";
          }
          txt += "</select><br/><input type='button' value='usun' onclick='_delete(this.form)'/></form>";
          document.getElementById('data').innerHTML = txt;
       }
    }
    request.open("GET", "http://pascal.fis.agh.edu.pl/~9zaczyk/project2/rest/list", true);
    request.send(null);
}

function _delete(form) {
    var rec = form.del.selectedIndex;
    var id = document.getElementsByTagName('option')[rec].value;
    var id_mongo = objJSON[id]['_id']['$oid'];
    document.getElementById('result').innerHTML = '';
    document.getElementById('data').innerHTML = '';  
    request = getRequestObject() ;
    request.onreadystatechange = function() {
       if (request.readyState == 4 )    {
           document.getElementById('result').innerHTML = request.response;
       }
    }
print (id_mongo);
    request.open("DELETE", "http://pascal.fis.agh.edu.pl/~9zaczyk/project2/rest/delete1/"+id_mongo, true);

    request.send(null);
}

// // Poprawa rekordow w bazie danych
// function _upd_list() {
//       doNotShowChart();
//        document.getElementById('result').innerHTML = '';
//        document.getElementById('data').innerHTML = '';  
//        request = getRequestObject() ;
//        request.onreadystatechange = function() {
//          if (request.readyState == 4)    {
//            objJSON = JSON.parse(request.response);
//            var txt = "<form name='data'><select name='del' size='10'>";
//            for ( var id in objJSON )  {
//               txt +=  "<option value="+id+" >"+id+": {" ;
//               for ( var prop in objJSON[id] ) {             
//                  if ( prop !== '_id')
//                    { txt += prop+":"+objJSON[id][prop]+",";  }
//                  else
//                    { txt += "oid:" + objJSON[id][prop]['$oid']+"," ;  }
//               }    
//               txt +="}</option>";
//            }
//            txt += "</select><br/><input type='button' value='popraw' onclick='_upd_form(this.form)'/></form>";
//           document.getElementById('data').innerHTML = txt;
//           }
//        }
//        request.open("GET", "http://pascal.fis.agh.edu.pl/~9zaczyk/project2/rest/list", true);
//        request.send(null);
//   }

// function _upd_form(form) {
//    var rec = form.del.selectedIndex;
//    id_rec = document.getElementsByTagName('option')[rec].value;
//    id_mongo = objJSON[id_rec]['_id']['$oid'];
//    console.log(id_mongo);
//    document.getElementById('result').innerHTML = '';
//    document.getElementById('data').innerHTML = '';  
//    var form1 = "<form name='add'><table>" ;
//    form1    += "<tr><td>ident</td><td><input type='text' name='ident' value='"+objJSON[id_rec]['ident']+"' ></input></td></tr>";
//    form1    += "<tr><td>fname</td><td><input type='text' name='fname' value='"+objJSON[id_rec]['fname']+"' ></input></td></tr>";
//    form1    += "<tr><td>lname</td><td><input type='text' name='lname' value='"+objJSON[id_rec]['lname']+"' ></input></td></tr>";  
//    form1    += "<tr><td>faculty</td><td><input type='text' name='faculty' value='"+objJSON[id_rec]['faculty']+"' ></input></td></tr>";
//    form1    += "<tr><td>year</td><td><input type='text' name='year' value='"+objJSON[id_rec]['year']+"' ></input></td></tr>";
//    form1    += "<tr><td></td><td><input type='button' value='wyslij' onclick='_update(this.form)' ></input></td></tr>";
//    form1    += "</table></form>";
//    document.getElementById('data').innerHTML = form1;
//    document.getElementById('result').innerHTML = '';
// }

// function _update(form) {
//     var user = {};
//     user.ident = form.ident.value;
//     user.fname = form.fname.value;
//     user.lname = form.lname.value;
//     user.faculty = form.faculty.value;
//     user.year = form.year.value;
//     txt = JSON.stringify(user);
//     document.getElementById('result').innerHTML = '';
//     document.getElementById('data').innerHTML = '';  
//     request = getRequestObject() ;
//     request.onreadystatechange = function() {
//          if (request.readyState == 4 && request.status == 200 )    {
//             document.getElementById('result').innerHTML = request.response;
//           }
//     }
//     request.open("PUT", "http://pascal.fis.agh.edu.pl/~9zaczyk/project2/rest/update1/"+id_mongo, true);
//     request.send(txt);
// }

// function _upd_find() {
//    doNotShowChart();
//    var form1 = "<form name='find'><table>" ;
//    form1    += "<tr><td>ident</td><td><input type='text' name='ident' value='ident' ></input></td></tr>";
//    form1    += "<tr><td></td><td><input type='button' value='szukaj' onclick='_find(this.form)' ></input></td></tr>";
//    form1    += "</table></form>";
//    document.getElementById('data').innerHTML = form1;
//    document.getElementById('result').innerHTML = '';
// }

// function _find(form)  {
//    const ident = form.ident.value;
//    document.getElementById('result').innerHTML = '';
//    document.getElementById('data').innerHTML = '';  
//    request = getRequestObject();
//    var isTrue = false;
//    request.onreadystatechange = function() {
//       if (request.readyState == 4 && request.status == 200) {
//          objJSON = JSON.parse(request.response)
//             if (objJSON.length !== 0) {
//                objJSON.forEach((el, index) => {
//                   if (ident == el.ident) {
//                      document.getElementById('result').innerHTML += `<li>${JSON.stringify(el)}</li>`
//                      isTrue = true;
//                   }
//                });
//          } 
//          if (!isTrue) {
//              document.getElementById('result').innerHTML = 'Nie znaleziono';
//          }
//       }
//    }
//    request.open("GET", "http://pascal.fis.agh.edu.pl/~9zaczyk/project2/rest/list", true);
//    request.send(null);
// }

//ankieta
function ankieta_form() {
   doNotShowChart();
	var form = "<form id='ankieta'>";

	form +=	"<p><b>Pytanie 1:</b> Ile godzin dziennie śpisz?</p>"+
			"<input type='radio' name='sen' value='5-6'>5-6<br>"+
			"<input type='radio' name='sen' value='7'>7<br>"+
			"<input type='radio' name='sen' value='8'>8<br>"+
			"<input type='radio' name='sen' value='9-10'>9 lub więcej</input><br>";
   form += "<p><b>Pytanie 2:</b> Ile godzin sumarycznie ćwiczysz w tygodniu ?</p>" +
         "<input type='radio' name='sport' value='0'>0<br>"+
			"<input type='radio' name='sport' value='1-2'>1-2<br>"+
			"<input type='radio' name='sport' value='3-4'>3-4<br>"+
      "<input type='radio' name='sport' value='5'>5 lub więcej<br>";
   form += "<p><b>Pytanie 3:</b> Ile godzin dziennie poświęcasz na cyfrowe życie</p>" +
      "<input type='radio' name='media' value='1'>mniej niż 1<br>" +
      "<input type='radio' name='media' value='1-2'>1-2<br>"+
		"<input type='radio' name='media' value='3-4'>3-4<br>"+
      "<input type='radio' name='media' value='5'>5 lub więcej<br>";
   form += "<p><b>Pytanie 4:</b> Czy medytujesz?</p>" +
      "<input type='radio' name='medytacja' value='tak'>tak<br>" +
      "<input type='radio' name='medytacja' value='nie'>nie<br>";
   // form += "<p><b>Pytanie 5:</b> Czy spędzasz czas na łonie natury przynajmniej raz w tygodniu?</p>" +
   //    "<input type='radio' name='natura' value='tak'>tak<br>" +
   //    "<input type='radio' name='natura' value='nie'>nie<br>";
   // form += "<p><b>Pytanie 6:</b> Czy spędzasz przynajmniej 10 min dziennie na kontaktu osobiste?</p>" +
   //    "<input type='radio' name='wiezi' value='tak'>tak<br>" +
   //    "<input type='radio' name='wiezi' value='nie'>nie<br>";
   // form += "<p><b>Pytanie 7:</b> Czy spędzasz przynajmniej 3 min dziennie na ćwiczenie empatii?</p>" +
   //    "<input type='radio' name='empatia' value='tak'>tak<br>" +
   //    "<input type='radio' name='empatia' value='nie'>nie<br>";

		
   var session_id = getSessionID();	
   console.log("Sesja"+session_id);
   document.getElementById('data').innerHTML = "Sessja:"+session_id;
	if(session_id == ''){
      form += "<input type='button' value='Prześlij' onclick='offline_insert(this.form)'>";
      form += "</form>";
		document.getElementById('data').innerHTML = form;
      document.getElementById('result').innerHTML = '';}

	else{
      form += "<input type='button' value='Prześlij' onclick='online_insert(this.form)'>";
      form += "</form>";
		document.getElementById('data').innerHTML = form;
      document.getElementById('result').innerHTML = '';;
	}
}

function online_insert(form) {
   var data = {};
	data.pyt1 = form.sen.value;
   data.pyt2 = form.sport.value;
   data.pyt3 = form.media.value;
   data.pyt4 = form.medytacja.value;
   // data.pyt5 = form.natura.value;
   // data.pyt6 = form.wiezi.value;
   // data.pyt7 = form.empatia.value;
   document.getElementById('result').innerHTML = '';
   document.getElementById('data').innerHTML = '';  
	txt = JSON.stringify(data);
	req = getRequestObject();
   req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
         objJSON = JSON.parse(req.response);
         if (objJSON['status'] == 'ok') {
            alert("Pomyślnie dodano dane online.");
         }
         else {
            alert("Błąd bazy danych. Nie dodano danych.");
         }
      }
      else if (req.readyState == 4 && req.status == 400) {
         alert("Wprowadzone dane są niepoprawne!");
      }
   };
	req.open("POST", "http://pascal.fis.agh.edu.pl/~9zaczyk/project2/rest/save", true);
   req.send(txt);
}


function offline_insert(form) {
		var data = {};
		data.pyt1 = form.sen.value;
      data.pyt2 = form.sport.value;
      data.pyt3 = form.media.value;
      data.pyt4 = form.medytacja.value;
      // data.pyt5 = form.natura.value;
      // data.pyt6 = form.wiezi.value;
      // data.pyt7 = form.empatia.value;
      document.getElementById('result').innerHTML = '';
      document.getElementById('data').innerHTML = '';  
		if(data.pyt1==""||data.pyt2=="" || data.pyt3=="" || data.pyt4==""){
			alert("Odpowiedz na wszystkie pytania!");
		}
      else {
		   var trans = db.transaction("ankieta", "readwrite");
         var obj = trans.objectStore("ankieta");
         
         if(obj.put(data)){
            alert("Pomyślnie dodano dane do bazy przeglądarki offline!");
         }
	   }	
}

function send_data() {
   let count = 0;
	var trans = db.transaction("ankieta", "readwrite");
	var obj = trans.objectStore("ankieta");
   obj.openCursor().onsuccess = function (event) {
		var cursor = event.target.result;
		
		if (cursor) {
			var data = {};
			data.pyt1 = cursor.value.pyt1;
         data.pyt2 = cursor.value.pyt2;
         data.pyt3 = cursor.value.pyt3;
         data.pyt4 = cursor.value.pyt4;

			txt = JSON.stringify(data);
         req = getRequestObject();
         req.onreadystatechange = function () {
         if (req.readyState == 4 && req.status == 200) {
            objJSON = JSON.parse(req.response);
            if (objJSON['status'] == 'ok') {
						alert("Dodano dane!");
               }
            }
         }
         req.open("POST", "http://pascal.fis.agh.edu.pl/~9zaczyk/project2/rest/save", true);
         req.send(txt);
			cursor.delete();
			cursor.continue();
      }
	};
}

//wyniki offline
function resultsOffline() {
	document.getElementById('result').innerHTML = 'Nie wprowadzono danych. Pamiętaj liczy się tylko pierwsza odpowiedź.';
   document.getElementById('data').innerHTML = ''; 
   var txt = "<h3>Lokalna baza:</h3>";
   txt = "<table>";
   txt += "<thead><tr><td>sen</td><td>sport</td><td>media</td><td>medytacja</td></tr></thead>";
   var trans = db.transaction("ankieta", "readwrite");
   var obj = trans.objectStore("ankieta");
  	obj.openCursor().onsuccess = function (event) {
      var cursor = event.target.result;
          if (cursor) {
            document.getElementById('result').innerHTML = '';
            txt += "<tr><td>" + cursor.value.pyt1 + "</td>";
            txt += "<td>" + cursor.value.pyt2 + "</td>";
            txt += "<td>" + cursor.value.pyt3 + "</td>";
            txt += "<td>" + cursor.value.pyt4 + "</td></tr>";
         txt += "</table>";
         document.getElementById('result').innerHTML = txt;
      }
   }
}

//wyniki online
function resultsOnline() {
   doNotShowChart();
	document.getElementById('result').innerHTML = '';
   document.getElementById('data').innerHTML = ''; 
   request = getRequestObject() ;
   request.onreadystatechange = function() {
      if (request.readyState == 4)    {
         objJSON = JSON.parse(request.response);
         var txt = "<table>";
         txt += "<thead><tr><td>sen</td><td>sport</td><td>media</td><td>medytacja</td></tr></thead>";

         for (var id in objJSON) {
            txt += "<tr><td>" + objJSON[id]['pyt1'] + "</td>";
            txt += "<td>" + objJSON[id]['pyt2'] + "</td>";
            txt += "<td>" + objJSON[id]['pyt3'] + "</td>";
            txt += "<td>"+ objJSON[id]['pyt4'] +"</td></tr>" ;
         }
         txt += "</table>";
         document.getElementById('result').innerHTML = txt;
      }
   }
   request.open("GET", "http://pascal.fis.agh.edu.pl/~9zaczyk/project2/rest/data", true);
   request.send(null);
}

function getdata(form) {
	document.getElementById('result').innerHTML = '';
   document.getElementById('data').innerHTML = ''; 

   var wynikiSen = [0,0,0,0];
	var wynikiSport = [0,0,0,0];
	var wynikiMedia = [0,0,0,0];
	var wynikiMedytacja = [0,0];
	request = getRequestObject() ;
   request.onreadystatechange = function() {
      if (request.readyState == 4)    {
         objJSON = JSON.parse(request.response);
         console.log("wchodze");
			for (var id in objJSON) {
            if (objJSON[id]['pyt1'] == "5-6") wynikiSen[0]++;
            if (objJSON[id]['pyt1'] == "7") wynikiSen[1]++;
            if (objJSON[id]['pyt1'] == "8") wynikiSen[2]++;
            if (objJSON[id]['pyt1'] == "9-10") wynikiSen[3]++;

            if (objJSON[id]['pyt2'] == "0") wynikiSport[0]++;
            if (objJSON[id]['pyt2'] == "1-2") wynikiSport[1]++;
            if (objJSON[id]['pyt2'] == "3-4") wynikiSport[2]++;
            if (objJSON[id]['pyt2'] == "5") wynikiSport[3]++;

            if (objJSON[id]['pyt3'] == "1") wynikiMedia[0]++;
            if (objJSON[id]['pyt3'] == "1-2") wynikiMedia[1]++;
            if (objJSON[id]['pyt3'] == "3-4") wynikiMedia[2]++;
            if (objJSON[id]['pyt3'] == "5") wynikiMedia[3]++;

            if (objJSON[id]['pyt4'] == "tak") wynikiMedytacja[0]++;
            if (objJSON[id]['pyt4'] == "nie") wynikiMedytacja[1]++;
			}
		}
		
		graph1(wynikiSen,wynikiSport,wynikiMedia,wynikiMedytacja);
   }
   request.open("GET", "http://pascal.fis.agh.edu.pl/~9zaczyk/project2/rest/data", true);
   request.send(null);
}

function graph1(wynikiSen, wynikiSport, wynikiMedia, wynikiMedytacja) {
   document.getElementsByClassName('chart')[0].style.display = 'block';
   document.getElementsByClassName('chart')[1].style.display = 'block';
   document.getElementsByClassName('chart')[2].style.display = 'block';
   document.getElementsByClassName('chart')[3].style.display = 'block';

   function histogram1(str,wynik,title,v1,v2,v3,v4) {
      let chartStatus = Chart.getChart(str); // <canvas> id
      if (chartStatus != undefined) {
      chartStatus.destroy();
      }
      //-- End of chart destroy   

      var chartCanvas = $('#' +str); //<canvas> id

      var xValues = [v1,v2,v3,v4];
      var yValues = [wynik[0], wynik[1],wynik[2],wynik[3]];
      var barColors = [
      "#b91d47",
      "#00aba9",
      "#2b5797",
      "#e8c3b9"
      ];

      chartInstance = new Chart(chartCanvas, {
      type: "pie",
      data: {
         labels: xValues,
         datasets: [{
            backgroundColor: barColors,
            data: yValues
         }]
      },
      options: {
         plugins: {
            title: {
                     font: {weight: 'bold'},
                     display: true,
                     text: title
                  }
            }
      }
      });
   }
   histogram1("myChart1", wynikiSen, 'Sen', "5-6", "7", "8", "9 =<");
   histogram1("myChart2", wynikiSport, 'Sport', "zero", "1-2", "3-4", "5=<");
   histogram1("myChart3", wynikiMedia, 'Media', "<=1", "1-2", "3-4", "5=<");

   function histogram2(str,wynik,title) {
      let chartStatus = Chart.getChart(str); // <canvas> id
      if (chartStatus != undefined) {
      chartStatus.destroy();
      }
      //-- End of chart destroy   

      var chartCanvas = $('#' +str); //<canvas> id

      var xValues = ["tak", "nie"];
      var yValues = [wynik[0], wynik[1]];
      var barColors = ["#b91d47", "#00aba9"];

      chartInstance = new Chart(chartCanvas, {
      type: "bar",
      data: {
         labels: xValues,
         datasets: [{
            backgroundColor: barColors,
            data: yValues
         }]
      },
      options: {
         plugins: {
            title: {
               font: {weight: 'bold'},
               display: true,
               text: title
            },
            legend: {display: false}
            }
   }
   });
   }
   histogram2("myChart4", wynikiMedytacja, 'Medytacja');
   
}

session();
function getRequestObject(){
   if ( window.ActiveXObject)  {
      return ( new ActiveXObject("Microsoft.XMLHTTP")) ;
   } else if (window.XMLHttpRequest)  {
      return (new XMLHttpRequest())  ;
   } else {
      return (null) ;
   }
}
function getSessionID() {
	var tmp;
	var cookies;
	cookies = document.cookie.split(';');
	for (var i = 0; i < cookies.length; i++) {
		tmp = cookies[i];
		while (tmp.charAt(0) == ' ') {
			tmp = tmp.substring(1, tmp.length);
		}
		if (tmp.indexOf("sessionID=") == 0) {
			return tmp.substring("sessionID=".length, tmp.length);
		}
	}
	return '';
}


function session() {
	var arr = {};
	var sID = getSessionID();
	arr.sessionID = sID;
	stringifiedData = JSON.stringify(arr);
	requestObj = getRequestObject();
	requestObj.onreadystatechange = function () {
		if (requestObj.readyState == 4 && (requestObj.status == 200 || requestObj.status == 400)) {
			JSON_responce = JSON.parse(requestObj.response);
			if (JSON_responce['status'] == 'ok') {
				show_logged_in();
			}
			else {
			}
		}
	}
	requestObj.open("POST", "http://pascal.fis.agh.edu.pl/~9zaczyk/rest/session", true);
	requestObj.send(stringifiedData);
}

function setSessionID(value) {
	document.cookie = "sessionID=" + value + "; path=/";
}