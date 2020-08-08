
const second = 1000,
minute = second * 60,
hour = minute * 60,
day = hour * 24;

let countDown = new Date('Sep 30, 2020 00:00:00').getTime(),
x = setInterval(function() {    

let now = new Date().getTime(),
    distance = countDown - now;

// document.getElementById('days').innerText = " "+Math.floor(distance / (day))+" ",
  document.getElementById('hours').innerText = " "+Math.floor((distance % (day)) / (hour))+" ",
  document.getElementById('minutes').innerText = " "+Math.floor((distance % (hour)) / (minute))+" ",
  document.getElementById('seconds').innerText = " "+Math.floor((distance % (minute)) / second)+" ";

//do something later when date is reached
//if (distance < 0) {
//  clearInterval(x);
//  'IT'S MY BIRTHDAY!;
//}

}, second)

 //declare variables  initForm userName receivedMsg
var chats = document.getElementById("chats");

var greyMsgbox = document.getElementById("send4");
var timebox = document.getElementById("send4"); //profileName_hidden
var profileName = document.getElementById("profileName");
var profileName_hidden = document.getElementById("profileName_hidden");


var initForm = document.getElementById("initForm");
var userName = document.getElementById("userName");
var userEmail = document.getElementById("userEmail");

var greyMsgbox = document.getElementById("send8");
var timeboxReceive = document.getElementById("send8");
var socket = io.connect();  
//  var socket = io('http://localhost: 8000');
var inputmsg = document.getElementById("inputmsg");
var msgPage = document.getElementById("msgPage");
var text;
var enterHere = ['hello'];

socket.emit('init_website', socket.id)


//we create date object so that we can use the variety of method 
//in the Date class e.g second, minute ect..
var d = new Date();
var m = new Date();
var mt = new Date();
var dd = new Date();
var s = new Date();

//we declare and populate the array with month name
//because the month method only return a number from one to tweve
// with this array we can identify which element/month the number that was return 
//refer to
var months = ["January", "February", "March", "April",
"May", "June", "July", "August", "September", "October",
"November", "December"];


//reveal chat box
//here we create a chat icon that reveal a form when it click




document.getElementById("revealed").addEventListener("click", function() {

  if ('<%= have_db  %>' == "yes") {
  // console.log("socket id: "+socket.id)
  // console.log("you click revealed")
document.getElementById("initForm").style.display = "<%= show_init_form %>"
document.getElementById("chat-container").style.display = "<%= show_chat %>";
document.getElementById("revealed").style.display = "none";
}else {
  
  // console.log("socket id: "+socket.id)
  // console.log("you click revealed")
document.getElementById("initForm").style.display = "block"
document.getElementById("chat-container").style.display = "none";
document.getElementById("revealed").style.display = "none";

}

});






// you can open or close the chat window after you've opened it 
document.getElementById("hide_button").addEventListener("click", function() {

document.getElementById("chat-container").style.display = "none";
document.getElementById("revealed_chat").style.display = "block";

})

// you can open or close the chat window after you've opened it
document.getElementById("revealed_chat").addEventListener("click", function() {


document.getElementById("chat-container").style.display = "block";
document.getElementById("revealed_chat").style.display = "none";

})

function revealed_chat_click(user_is_online) {
console.log("user_is_online: "+user_is_online)
var replacementzer =  user_is_online.replace("_Online", "")
console.log("\n")
console.log("replacement: "+replacementzer)
socket.emit("_need_this_client_data", replacementzer)
}


socket.on("connect", function() {
var tt = socket.id
var tt3 = socket.id+"<%= own_token %>_Online"
// console.log("socket length: "+tt.length)
// console.log("socket+token length: "+tt3.length)
// console.log("before socket+token: "+tt3)
// console.log("after socket+token: "+tt3.slice(20,tt3.length))
// console.log("connect connect connect: "+"<%= own_token %>_Online")
socket.emit("client_online", "<%= own_token %>_Online")
socket.emit("client_online_token_and_socketId", socket.id+"<%= own_token %>_Online")
})


function buttonSend_click(click_id)
{

   //   console.log("818 token id button_send: "+click_id)
      var actual_token_fromButtonSubmitID = click_id.slice(0,156)
    //  console.log("click_id.slice(0,156): "+actual_token_fromButtonSubmitID)
//var pos = str.replace("_submit", '')
// var pos = actual_token_fromButtonSubmitID.search("_submit");
//  var length_str = actual_token_fromButtonSubmitID.length;
// var slice_str_token = actual_token_fromButtonSubmitID.slice(0, pos);
var slice_str_token = actual_token_fromButtonSubmitID.replace("_submit", '')
// console.log("slice_str_token: "+slice_str_token)
    
      // console.log("click_id _156: "+ _156)
      // console.log("click_id _149: "+ _149)

      socket.emit('connect_to_thisId', {
        id: socket.id, 
        name: userName.value, 
          email: userEmail.value, 
          button_token: slice_str_token })

         
       var identify_hidden_socketId_div = document.createElement('div')
       //identify_hidden_socketId_div.setAttribute("id", userName.value+"_"+socket.id+"_"+slice_str_token+"_")
       identify_hidden_socketId_div.setAttribute("id", socket.id)
       identify_hidden_socketId_div.style.display= "none"

  socket.emit('new user', userName.value, function(data){
  if(data)
  {
  document.getElementById("initForm").style.display = "none";
  document.getElementById("chat-container").style.display = "block";
  }
  }); // profileName_hidden
  profileName.innerText = "Salesman" //userName.value;
  profileName_hidden.innerText = userName.value;
  c_active = document.getElementById("chat_activee")
  identify_div = document.createElement("div")
  identify_div.style.display = "none"
  identify_div.setAttribute("id", userName.value+"_"+socket.id)
  c_active.appendChild(identify_div)
  c_active.appendChild(identify_hidden_socketId_div)
  //document.getElementById("identify").innerText = userName.value+"_"+socket.id
  // console.log("(after form) profileName.innerText: "+profileName.innerText);
  // console.log("profileName[0]: "+profileName.innerText.substring(1,0));
  userName.value = '';
      
}

//enter name
//when the form is reveal the user is require to enter his/her user name
//when the user name is submitted the live chat interface is reveal
// document.getElementById("chat_bution").addEventListener("click", function() {


//   socket.emit('connect_to_thisId', {id: socket.id, name: userName.value, email: userEmail.value })

// socket.emit('new user', userName.value, function(data){
// if(data)
// {
// document.getElementById("initForm").style.display = "none";
// document.getElementById("chat-container").style.display = "block";
// }
// }); // profileName_hidden
// profileName.innerText = "Salesman" //userName.value;
// profileName_hidden.innerText = userName.value;
// c_active = document.getElementById("chat_activee")
// identify_div = document.createElement("div")
// identify_div.style.display = "none"
// identify_div.setAttribute("id", userName.value+"_"+socket.id)
// c_active.appendChild(identify_div)
// //document.getElementById("identify").innerText = userName.value+"_"+socket.id
// // console.log("(after form) profileName.innerText: "+profileName.innerText);
// // console.log("profileName[0]: "+profileName.innerText.substring(1,0));
// userName.value = '';
// });




//get the users
//this function get the username that was enter in the form
// socket.on('get users', function(data){

// enterHere.push(data);

// })

//when send button is clicked
//this grab the chat input field and submit the data that the user enter
// the server using socket.io library

function realbuttonSend_click(click_id) {
if(inputmsg.value.trim().length > 0)
{

  socket.emit("send message", 
  {msg: inputmsg.value, 
  name: profileName_hidden.innerText, 
  cus_id: click_id,
identity_req: click_id});
inputmsg.value = "";

}


}

// document.getElementById("sender").addEventListener("click", function() { 
// //take msg from input
// // profileName.innerText
// socket.emit("send message", {msg: inputmsg.value, name: profileName_hidden.innerText, cus_id: socket.id});
// inputmsg.value = "";
// });

//msg transfered through socket
//using the server with socket.io the data (message and username) 
//is transfer to anyone that is connected
socket.on('new message', function(data){

// console.log("data.this_customer: "+data.this_customer)
// console.log("document.getElementById(data.this_customer): "+ document.getElementById(data.this_customer))

if (document.getElementById(data.this_customer) ) {
// console.log("yes this customer")
// console.log("data.this_customer: "+data.this_customer)
//console.log("div identify: "+document.getElementById("identify").innerHTML)
text = data.msg;
var clir = data.name;
//var activeUser = data.user;

// inputmsg.style.width = '20px';

  if(profileName.innerText == clir)
  {
  //declaring the receive variables (grey)
  var rc = document.createElement("div");
  var rci = document.createElement("div");
  var rmr = document.createElement("div");
  var rmis = document.createElement("div");
  var pCreated = document.createElement("p");
  var timeCreated = document.createElement("span"); 


  pCreated.innerText = text;
  timeCreated.innerText = clir+"    "+data.timeMoment;
//  console.log("profileName.innerText: "+profileName.value);


  //styling Receive-msg id= receivedMsg = rmr
  rmr.style.display = 'inline-block';
  rmr.style.padding = '0 0 0 10px';
  rmr.style.verticalAlign = 'top';
  rmr.style.width = '92%';


  //styling Receive-msg inbox send  id = send8
  rmis.style.width = '70%';

  //styling the paragraph Received grey color
  pCreated.style.background = '#efefef none repeat scroll 0 0';
  pCreated.style.borderRadius = '0px 20px 20px 20px';
  pCreated.style.color = '#646464';
  pCreated.style.fontSize = '14px';
  pCreated.style.margin = '0';
  pCreated.style.padding = '5px 10px 5px 12px';
  pCreated.style.width = '100%';


  // styling time/name section
  timeCreated.style.color = '#777';
  timeCreated.style.display = 'block';
  timeCreated.style.fontSize = '12px';
  timeCreated.style.margin = '8px 0 8px';

  msgPage.appendChild(rc);
  rc.appendChild(rci);
  rc.appendChild(rmr);
  rmr.appendChild(rmis);
  rmis.appendChild(pCreated);
  rmis.appendChild(timeCreated);
  msgPage.scrollTo(0,msgPage.scrollHeight);
  }else
  {
  //declaring the outgoing msg variables (green)
  var oc = document.createElement("div");
  var ocm = document.createElement("div");
  var oci = document.createElement("div");
  var pCreated = document.createElement("p");
  var timeCreated = document.createElement("span"); 


  //styling outgoing-chats
  oc.style.overflow = 'hidden'; 
  oc.style.margin = '26px 20px';

  //styling the paragraph outgoing green color
  pCreated.style.background = 'rgb(236, 6, 141) none repeat scroll 0 0';''
  pCreated.style.color = '#fff';
  pCreated.style.borderRadius = '20px 0px 20px 20px';
  pCreated.style.fontSize = '14px';
  pCreated.style.margin = '0';
  pCreated.style.color = '#fff';
  pCreated.style.padding = '5px 10px 5px 12px';
  pCreated.style.width = '100%';


  // styling time/name section
  timeCreated.style.color = '#777';
  timeCreated.style.display = 'block';
  timeCreated.style.fontSize = '12px';
  timeCreated.style.margin = '8px 0 0';

  //styling outgoing-chats-msg
  ocm.style.float = 'right'; 
  ocm.style.width = '70%';
  ocm.style.marginLeft = '0';

  //styling outgoing-chats-img
  oci.style.display = 'inline-block';
  oci.style.width = '20px';
  oci.style.float = 'right';

  pCreated.innerText = text;
  timeCreated.innerText = clir+" "+data.timeMoment;
 // console.log("profileName.innerText: "+profileName.value);


  msgPage.appendChild(oc);
  oc.appendChild(ocm);
  ocm.appendChild(pCreated);
  ocm.appendChild(timeCreated);
  oc.appendChild(oci);
  msgPage.scrollTo(0,msgPage.scrollHeight);
  }

} else {
console.log("no not this customer")

}


});


// msg from admin

socket.on('new messageAdmin', function(data){

// console.log("data.this_customer: "+data.this_customer)
// console.log("data.receiver: "+data.receiver)
// console.log("+data.name: "+data.name)

// document.getElementById("messageNotice").play();
document.getElementById("notification_up").play();
//console.log("document.getElementById(data.this_customer): "+ document.getElementById(data.this_customer))

if (document.getElementById(data.this_customer) ) { 
// console.log("new messageAdmin")
// console.log("yes this customer")
// console.log("data.this_customer: "+data.this_customer)
//console.log("div identify: "+document.getElementById("identify").innerHTML)
text = data.msg;
var clir = data.receiver;
//var activeUser = data.user;

// inputmsg.style.width = '20px';

if("Salesman" !== clir)
{
//declaring the receive variables (grey)
var rc = document.createElement("div");
var rci = document.createElement("div");
var rmr = document.createElement("div");
var rmis = document.createElement("div");
var pCreated = document.createElement("p");
var timeCreated = document.createElement("span");


pCreated.innerText = text;
timeCreated.innerText = data.name+"    "+data.timeMoment;
// console.log("profileName.innerText: "+profileName.value);


//styling Receive-msg id= receivedMsg = rmr
rmr.style.display = 'inline-block';
rmr.style.padding = '0 0 0 10px';
rmr.style.verticalAlign = 'top';
rmr.style.width = '92%';


//styling Receive-msg inbox send  id = send8
rmis.style.width = '70%';

//styling the paragraph Received grey color
pCreated.style.background = '#efefef none repeat scroll 0 0';
pCreated.style.borderRadius = '0px 20px 20px 20px';
pCreated.style.color = '#646464';
pCreated.style.fontSize = '14px';
pCreated.style.margin = '0';
pCreated.style.padding = '5px 10px 5px 12px';
pCreated.style.width = '100%';


// styling time/name section
timeCreated.style.color = '#777';
timeCreated.style.display = 'block';
timeCreated.style.fontSize = '12px';
timeCreated.style.margin = '8px 0 8px';

msgPage.appendChild(rc);
rc.appendChild(rci);
rc.appendChild(rmr);
rmr.appendChild(rmis);
rmis.appendChild(pCreated);
rmis.appendChild(timeCreated);
msgPage.scrollTo(0,msgPage.scrollHeight);
}else
{
//declaring the outgoing msg variables (green)
var oc = document.createElement("div");
var ocm = document.createElement("div");
var oci = document.createElement("div");
var pCreated = document.createElement("p");
var timeCreated = document.createElement("span");


//styling outgoing-chats
oc.style.overflow = 'hidden'; 
oc.style.margin = '26px 20px';

//styling the paragraph outgoing green color
pCreated.style.background = 'rgb(236, 6, 141) none repeat scroll 0 0';''
pCreated.style.color = '#fff';
pCreated.style.borderRadius = '20px 0px 20px 20px';
pCreated.style.fontSize = '14px';
pCreated.style.margin = '0';
pCreated.style.color = '#fff';
pCreated.style.padding = '5px 10px 5px 12px';
pCreated.style.width = '100%';


// styling time/name section
timeCreated.style.color = '#777';
timeCreated.style.display = 'block';
timeCreated.style.fontSize = '12px';
timeCreated.style.margin = '8px 0 0';

//styling outgoing-chats-msg
ocm.style.float = 'right'; 
ocm.style.width = '70%';
ocm.style.marginLeft = '0';

//styling outgoing-chats-img
oci.style.display = 'inline-block';
oci.style.width = '20px';
oci.style.float = 'right';

pCreated.innerText = text;
timeCreated.innerText = data.receiver+" "+data.timeMoment;
//console.log("profileName.innerText: "+profileName.value);


msgPage.appendChild(oc);
oc.appendChild(ocm);
ocm.appendChild(pCreated);
ocm.appendChild(timeCreated);
oc.appendChild(oci);
msgPage.scrollTo(0,msgPage.scrollHeight);
}

} else {
console.log("no not this customer")

}


});


socket.on("this_socket_disconnect", function(data){
console.log("this id got disconnected: "+data) 
})

function itTime() {
return months[mt.getMonth()]+" "+dd.getDate();
}

