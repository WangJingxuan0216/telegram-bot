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

	//saving password to database
	passwordSaving: function (msg, match) {
		var chatId = msg.chat.id;
		var pwFormat = new RegExp(/([a-zA-Z0-9]+\:[a-zA-Z0-9@#]+)$/);
		var resp = match[1];
		if (admin.indexOf(chatId) >= 0){
			if (resp.match(pwFormat)){
				bot.sendMessage(chatId, "My Lord, please wait, I am saving password for you!!!");

				var message = resp.split(":");
				var pwMessage = {"name": message[0], "password": message[1]};
				console.log(pwMessage);
				util.saveToDB(pwMessage, "pw");
			}else{
				bot.sendMessage(chatId, "Wrong password format, it should only contain alphabet/number/#/@ and in foramt: software:password");
			}
		}else{
			bot.sendMessage(chatId, "Hello Stranger, this function is only available to my lord");
		}
	},

	//retrieving password from database
	passwordRetrieving: function(msg, match) {
		var chatId = msg.chat.id;
		var nameFormat = new RegExp(/([a-zA-Z0-9]+)$/);
		var resp = match[1];
		if (admin.indexOf(chatId) >= 0){
			if (resp.match(nameFormat)){
				var message = resp;
				var queryMessage = {};
				queryMessage["name"] = message
				console.log(queryMessage);
				var result = util.retrieveDT(queryMessage, "pw");
				
				bot.sendMessage(chatId, "password");
			}else{
				bot.sendMessage(chatId, "Wrong password format, it should only contain alphabet/number/#/@ and in foramt: software:password");
			}
		}else{
			bot.sendMessage(chatId, "Hello Stranger, this function is only available to my lord");
		}
	}
};