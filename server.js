var port = process.env.PORT || 8080;
var express = require("express");
var app = new express();
var http = require("http").Server(app);
var moment = require("moment");
var io = require("socket.io")(http);

// send at the client all files into public folder
app.use(express.static(__dirname + "/public"));


io.on("connection", function (socket) { //listen the connection request from the clients

    console.log("Require connection from the client");

    socket.emit("message", {
        name: "System",
        text: "<strong>Welcome into chat application!</strong>",
        timestamp: moment().valueOf()
    });

    socket.on("message", function (message) {   // listen on the message event for received the new messages from the clients

        console.log("Received a message");

        io.emit("message", {    //send the message received at all client connected
            text: message.text,
            timestamp: moment().valueOf()
        })
    })
});









http.listen(port, function () {

    console.log("Server started at port: 8080");

})