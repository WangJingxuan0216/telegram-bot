var TelegramBot = require('node-telegram-bot-api');
var https = require('https');
var fs = require('fs');
var schedule = require('node-schedule');
var response = require('./response');
var key = JSON.parse(fs.readFileSync('key.json','utf8'));

token = key.token;
admin = key.admin;

bot = new TelegramBot(token, {polling: {timeout: 20, interval: 5000}});

console.log("bot server started...");

// response on incoming message
bot.on('message', function(msg){
	if ("photo" in msg){
		// saving photo
		response.savingPhoto(msg);
	}
	else{
		//say hello to user
		bot.onText(/^\/hello (.+)$/, response.hello);

		//saving password for user
		bot.onText(/^\/pw (.+)$/, response.passwordSaving);

		//retrieving password to user 
		bot.onText(/^\/pwget (.+)$/, response.passwordRetrieving);

		//updating password for user 
		bot.onText(/^\/pwcg (.+)$/, response.passwordUpdating);

		//sending photos to user
		bot.onText(/^\/photo (.+)$/, function(msg){
			var chatId = msg.chat.id;
			if (admin[0] == chatId){
				console.log("sending photo");
				var path = '/mnt/Media/Photos';
				var file_list = fs.readdirSync(path);
				var max = file_list.length;
				var number = Math.floor(Math.random()*max) + 1;
				var photo = path+'/'+file_list[number];
				bot.sendPhoto(admin[0], photo);
			}else{
				bot.sendMessage(chatId, "Hello Stranger, this function hasn't opened to you");
			}
		});
	};
});



// // sending photos at scheduled time
var morningNewsTime = "*/15 30 14 * * *"
var sendingPhotos = schedule.scheduleJob(morningNewsTime, function() {
	console.log("Happy Time");
	var path = '/mnt/Media/Photos';
	var file_list = fs.readdirSync(path);
	var max = file_list.length;
	var number = Math.floor(Math.random()*max) + 1;
	var photo = path+'/'+file_list[number];
	bot.sendPhoto(admin[0], photo);
});
