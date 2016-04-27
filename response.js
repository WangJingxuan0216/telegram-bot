var util = require('./util');

module.exports = {
	//say hello to the user
	hello: function (msg, match) {
		var chatId = msg.chat.id;

		//to admin user
		if (admin.indexOf(chatId) >= 0) {
			var resp = match[1];
			bot.sendMessage(chatId, 'Hello ' + resp + '!').then(function () {
		});
		// to unauthorised user
		}else{
			bot.sendMessage(chatId, "Hello Stranger, Welcome to my bot");
		}
	},
	password: function (msg, match) {
		var chatId = msg.chat.id;
		var pwFormat = new RegExp(/([a-zA-Z0-9]+\:[a-zA-Z0-9@#]+)$/);
		var resp = match[1];
		if (admin.indexOf(chatId) >= 0){
			if (resp.match(pwFormat)){
			bot.sendMessage(chatId, "My Lord, please wait, I am saving password for you!!!");
			}else{
				bot.sendMessage(chatId, "Wrong password format, it should only contain alphabet/number/#/@ and in foramt: software:password");
			}
		}else{
			bot.sendMessage(chatId, "Hello Stranger, this function is only available to my lord");
		}
		

		var message = resp.split(":");
		var pwMessage = {};
		pwMessage[message[0]] = message[1];
		console.log(pwMessage);
		
		util.saveToDB(pwMessage, "pw");



	}
};