var port = process.env.PORT || 8080;
var express = require("express");
var app = new express();
var http = require("http").Server(app);
var moment = require("moment");
var io = require("socket.io")(http);

// send at the client all files into public folder
app.use(express.static(__dirname + "/public"));

var clientInfo = {};

io.on("connection", function (socket) { //listen the connection request from the clients

    console.log("Require connection from the client");

    socket.emit("message", {
        name: "System",
        text: "<p><strong>Welcome into chat application!</strong></p>"
    });

    socket.on("disconnect", function () {

        var currentUser = clientInfo[socket.id];

        socket.leave(clientInfo[currentUser.room]); //the sokect leave current room for a specific user

        socket.broadcast.to(currentUser.room).emit("message", {
            name: "System",
            text: currentUser.name + " has left!",
            timestamp: moment().valueOf()
        })

        delete currentUser;
    })

    socket.on("message", function (message) {   // listen on the message event for received the new messages from the clients

        console.log("Received a message");

        if (message.text === "@currentUsers") {

            showAllUsers(socket);
        }

        message.timestamp =  moment().valueOf();

        io.to(clientInfo[socket.id].room).emit("message", message);    //send the message received at all client connected
    })

    //for sending at all users that partecipate in a room that a new user it has arrived
    socket.on("joinRoom", function (request) {

        // insert into client info object ( into object id of array socket ) the object resquest that contain id, name and room
        clientInfo[socket.id] = request;    

        socket.join(request.room);  // call socket and insert a new room

        socket.broadcast.to(request.room).emit("message", { //send the message at all users into current room
            name: "System",
            text: request.name + " has joined into this room!"
        });
    })

    // for show wich users has connected into room of the user that has sended the message @currentUsers
    function showAllUsers(socket) {

        var infoCurrentUser = clientInfo[socket.id];    // save current informations of user that hase sended this message ( name, room )

        var userConnected = [];

        Object.keys(clientInfo).forEach(function (socketId) {

            var infoUser = clientInfo[socketId];

            if (infoCurrentUser.room === infoUser.room) {
                userConnected.push(infoUser.name);
            }
        })

        socket.emit("message", {
            name: "System",
            text: userConnected + " are connected",
            timestamp: moment().valueOf()

        })
    }
});


http.listen(port, function () {

    console.log("Server started at port: 8080");

})