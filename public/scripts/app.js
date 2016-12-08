var socket = io();  //require a connection at the server


var name = getQueryVariable("name") || "Anonymous";    //get name params from the URL 
var room = getQueryVariable("room");    //get room params from the URL 

jQuery(".room").append(room);

socket.on("connect", function () {

    console.log("Client connected");

    socket.emit("joinRoom", {
        name: name,
        room: room
    })
});

socket.on("message", function (message) {   // listen if arrived a new message from the server

    //take the current local time, convert from binary format into utc and use a hour format 
    var timestamp = moment().local().utc(message.timestamp).format("h:mm a");   

    var $messages = jQuery("#messages"); 
    
    $messages.append("<p><strong>" + message.name + " - " + timestamp + "</strong></p>"); //insert message received into .messages element of the view


    $messages.append("<p>" + message.text +"</p>"); //insert message received into .messages element of the view

})

var $form = jQuery(".form");    //take a reference of form element
var $newMessage = $form.find("input[id=message]"); // find a element into form element 


//send a message at the server
$form.on("submit", function (event) {

    event.preventDefault(); // stop the default event of submit action

    socket.emit("message", {
        name: name,
        text: $newMessage.val(), //send a new message at the server wit the value of input element into the view
        timestamp: moment().valueOf()
    })
    $newMessage.val("");
})