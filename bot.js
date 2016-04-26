var TelegramBot = require('node-telegram-bot-api');

var token = "213942986:AAG945F9_po0KFoZYkwD5pAJrXXqtwbDeUc";
var admin = [168797372]

var bot = new TelegramBot(token, {polling: true});

console.log("bot server started...");

bot.onText(/^\/hello (.+)$/, function (msg, match) {
	var chatId = msg.chat.id;
	console.log(chatId);
	console.log(admin.indexOf(chatId))
	if (admin.indexOf(chatId) >= 0) {
		var resp = match[1];
		bot.sendMessage(chatId, 'Hello ' + resp + '!').then(function () {
	});
	}else{
		bot.sendMessage(chatId, "Hello Stranger, Welcome to my bot");
	}
});     