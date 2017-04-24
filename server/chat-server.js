var io = require('socket.io')(3000);

io.on('connection', function(socket){

	socket.on('join:room', function(data){
		console.log(data);
		var room_name = data.room_name;
		console.log(room_name);
		socket.join(room_name);
	});


	socket.on('leave:room', function(msg){
		console.log(msg);
		msg.text = msg.user + ' has left the room';
		socket.leave(msg.room);
		socket.in(msg.room).emit('message', msg);
	});


	socket.on('send:message', function(msg){
		console.log(msg);
		socket.in(msg.room).emit('message', msg);
	});


});
