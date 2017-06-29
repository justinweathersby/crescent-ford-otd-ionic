app.factory('SocketService',function(socketFactory){
    return socketFactory({
        //ioSocket: io.connect('http://localhost:3000')
      ioSocket: io.connect('https://immense-thicket-93631.herokuapp.com/')
        //ioSocket: io.connect('https://onetouchsocketchat.herokuapp.com/')
    });
})
