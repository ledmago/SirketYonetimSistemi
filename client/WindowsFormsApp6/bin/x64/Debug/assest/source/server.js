var io = require('socket.io').listen(3000); //3000 portunu dinlemeye başladık.
    io.set('log level',0);
	io.sockets.on('connection', function(socket){ // tüm node işlemlerini kapsayan ana fonksiyonumuz
	console.log('Connect' + socket.id);

	
	
        socket.on('mesajgonder', function(data){ //clientte'ki mesajı aldık

            socket.emit('mesajgitti', data) //server mesajı client'e geri gönderdi emit ile
            socket.broadcast.emit('mesajgitti', data) //
			
			console.log(data.uid);
        });
		
		
		 socket.on('disconnect', function() {
      console.log('Got disconnect!' + socket.id);

		 });
});