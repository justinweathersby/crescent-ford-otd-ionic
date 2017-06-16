
// app.factory('SocketService',function(socketFactory){
//        //Create socket and connect to http://chat.socket.io
//
//
//        var myIoSocket = io.connect('http://localhost:3000');
//
//        mySocket = socketFactory({
//            ioSocket: myIoSocket
//        });
//
//        return mySocket;
//
// })
 app.service('SocketService',function(socketFactory){
//.service('SocketService', ['socketFactory', SocketService]);

  // function SocketService(socketFactory){
       return socketFactory({

        //   ioSocket: io.connect('http://localhost:3000')
        ioSocket: io.connect('https://immense-thicket-93631.herokuapp.com/')
         //ioSocket: io.connect('https://onetouchsocketchat.herokuapp.com/')


       });
//   }
})
