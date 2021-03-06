const util = require('./util');
const fs = require('fs');

var commandList = "/pw(for saving password)\n/pwget(for retrieving password)\n/pwcg(for changing password)"

module.exports = {
	
	//say hello to the user
	hello: function (msg, match) {
		var chatId = msg.chat.id;
		console.log(chatId);
		//to admin user
		if (admin.indexOf(chatId) >= 0) {
			var resp = match[1];
			bot.sendMessage(chatId, 'Hello ' + resp + '! Here is the list of functions you can use now:\n'+commandList).then(function () {
		});
		// to unauthorised user
		}else{
			bot.sendMessage(chatId, "Hello Stranger, Welcome to my bot!");
		}
	},

	//saving password to database
	passwordSaving: function (msg, match) {
		var chatId = msg.chat.id;
		var pwFormat = new RegExp(/([a-zA-Z0-9]+\:[a-zA-Z0-9@#]+)$/);
		var resp = match[1];
		if (admin.indexOf(chatId) >= 0){
			if (resp.match(pwFormat)){
				var message = resp.split(":");
				var pwMessage = {"name": message[0].toLowerCase(), "pw": message[1]};
				console.log(pwMessage);
				var sendingMessage = function(data){
					bot.sendMessage(chatId, data);
				}
				var response = "My lord, your password has been saved successfully!";
				util.saveToDB(pwMessage, "pw", response, sendingMessage);
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
				var message = resp.toLowerCase();
				var queryMessage = {};
				queryMessage["name"] = message
				console.log(queryMessage);
				var sendingMessage = function(data){
					bot.sendMessage(chatId, data);
				}
				util.retrieveDT(queryMessage, "pw", sendingMessage);
			}
		}else{
			bot.sendMessage(chatId, "Hello Stranger, this function is only available to my lord!");
		}
	},

	// updating password if found in database, otherwise insert this to database
	passwordUpdating: function(msg, match) {
		var chatId = msg.chat.id;
		var pwFormat = new RegExp(/([a-zA-Z0-9]+\:[a-zA-Z0-9@#]+)$/);
		var resp = match[1];
		if (admin.indexOf(chatId) >= 0){
			if (resp.match(pwFormat)){
				var message = resp.split(":");
				var queryMessage = {"name": message[0].toLowerCase()};
				console.log(queryMessage);
				var pwMessage = {"name": message[0].toLowerCase(), "pw": message[1]};
				console.log(pwMessage);
				var sendingMessage = function(data){
					bot.sendMessage(chatId, data);
				}
				var response = "My lord, your password has been updated successfully!";
				util.updateDT(queryMessage, pwMessage, "pw", response, sendingMessage);
			}else{
				bot.sendMessage(chatId, "Wrong password format, it should only contain alphabet/number/#/@ and in foramt: software:password");
			}
		}else{
			bot.sendMessage(chatId, "Hello Stranger, this function is only available to my lord");
		}
	},

	//receiving photo from master
	savingPhoto: function(msg) {
		var chatId = msg.chat.id;
		var fileId = msg.photo[msg.photo.length-1].file_id;
		if (admin.indexOf(chatId) >= 0){
			var filePath = "/home/pi/Media/Photos/lubei";
			if (admin.indexOf(chatId) == 0){
				filePath = "/mnt/Media/Photos";
			}
			console.log("saving photo...")
			bot.downloadFile(fileId, filePath);
			var response = "Your photo has been successfully saved"
			bot.sendMessage(chatId, response);
		}else{
			bot.sendMessage(chatId, "Hello Stranger, this function is only available to my lord")
		};
	},

	//sending photo to master1
	sendingPhoto: function(msg) {
		var chatId = msg.chat.id;
		if (my_lord == chatId){
			console.log("sending photo");
			var path = '/mnt/Media/Photos';
			var file_list = fs.readdirSync(path);
			var max = file_list.length;
			var number = Math.floor(Math.random()*max) + 1;
			var photo = path+'/'+file_list[number];
			bot.sendPhoto(my_lord, photo);
		}else{
			bot.sendMessage(chatId, "Hello Stranger, this function hasn't opened to you");
		};
	},

	// sending drama update
	sendingDramaUpdate: function(){
		console.log("crawling the webpage");
		var obj;
		fs.readFile('/home/pi/Program/drama_output.json', function(err, data){
			try {
				obj = JSON.parse(data);
				console.log("new update");
				for (var x=0;x<obj.length; x++){
					for(var y=0;y<admin.length; y++){
						bot.sendMessage(admin[y], "New update:\n"+obj[x].name);
						bot.sendMessage(admin[y], obj[x].link);
					}
				}
			}catch(err){
				console.log("no update");
				for(var y=0;y<admin.length; y++){
					bot.sendMessage(admin[y], "No new update");
				}
			}
		});
	}
};
