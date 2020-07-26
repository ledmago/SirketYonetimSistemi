var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

function session_kotrol(text)
{
	try {var session_kadi = decrypt(text);return true;} catch (err) { return false}
	
}

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ledmago"
});
console.log('\033[2J');
con.connect(function(err) {
  if (err) throw err;
   if (err){console.log("Mysql Veri tabanına Bağlanılamadı");}else{console.log('\033[2J');console.log("Mysql Bağlantısı Gerçekleştirildi!");}
  
 
});

var io = require('socket.io').listen(3000); //3000 portunu dinlemeye başladık.
    io.set('log level',0);
	io.sockets.on('connection', function(socket){ // tüm node işlemlerini kapsayan ana fonksiyonumuz
	console.log('Connect' + socket.id);

	
	
		
        socket.on('baglan', function(gelen_data){
			

		//clientte'ki mesajı aldık
			var kadi = gelen_data.kadi;
			var sifre = gelen_data.sifre;
			
			
			con.query("SELECT * FROM kullanicilar WHERE kadi='" + kadi + "' and sifre='"+ sifre + "'", function (err, result, fields) {
				//if (result[0].kadi){console.log("Yanlış Kullanıcı Adı Veya Şifre");}else{console.log("Giriş Yapıldı");}
				
			
				try{
				if (result.length > 0) {
					
					var gonder = encrypt(result[0].kadi);
					socket.emit('baglanti_durumu', gonder)
					}else{
					socket.emit('baglanti_durumu', "yok")
					}
				  }catch(err){
					socket.emit('baglanti_durumu', "yok")}
			  });
		});
	
	
        socket.on('mesajgonder', function(data){ //clientte'ki mesajı aldık

            socket.emit('mesajgitti', data) //server mesajı client'e geri gönderdi emit ile
            socket.broadcast.emit('mesajgitti', data) //
			
			console.log(data.uid);
        });
		
		
		 socket.on('disconnect', function() {
      console.log('Got disconnect!' + socket.id);

		 });
});