var socket = io();  //require a connection at the server


socket.on("connect", function () {

    console.log("Client connected");

});

socket.on("message", function (message) {   // listen if arrived a new message from the server

    var $messages = jQuery(".messages");    

    $messages.append("<p>" + message.text + "</p>"); //insert message received into .messages element of the view

})

var $form = jQuery(".form");    //take a reference of form element
var $newMessage = $form.find("input[class=message]"); // find a element into form element 


//send a message at the server
$form.on("submit", function (event) {

    event.preventDefault(); // stop the default event of submit action

    socket.emit("message", {
        text: $newMessage.val() //send a new message at the server wit the value of input element into the view
    })
    $newMessage.val("");
})