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
		bot.onText(/^\/photo (.+)$/, response.sendingPhoto);
	};
});