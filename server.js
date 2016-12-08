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
        text: "<p><strong>Welcome into chat application!</strong></p>"
    });

    socket.on("message", function (message) {   // listen on the message event for received the new messages from the clients

        console.log("Received a message");

        message.timestamp =  moment().valueOf();

        io.emit("message", message);    //send the message received at all client connected
    })
});









http.listen(port, function () {

    console.log("Server started at port: 8080");

})