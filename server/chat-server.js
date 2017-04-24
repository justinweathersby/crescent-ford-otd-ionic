var io = require('socket.io')(3000);
// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
//
// io.on('connection', function(socket){
//   console.log('a user connected');
// });
//
// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });
//
//
// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });
io.on('connection', function(socket){
  console.log("any connection");

    socket.on('join:room', function(data){
      console.log(data);
        // var room_name = data.room_name;
        // socket.join(room_name);
        // console.log('someone joined room ' + room_name + ' ' + socket.id);
    });


    socket.on('leave:room', function(msg){
        msg.text = msg.user + " has left the room";
        socket.in(msg.room).emit('exit', msg);
        socket.leave(msg.room);
    });


    socket.on('send:message', function(msg){
      console.log(msg);
        socket.in(msg.room).emit('message', msg);
    });

    socket.on('connect', function(msg){
      console.log("connect");
         socket.in(msg.room).emit('message', msg);
    });

});
