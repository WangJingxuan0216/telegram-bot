var TelegramBot = require('node-telegram-bot-api');
var https = require('https');
var fs = require('fs');
var schedule = require('node-schedule');
var response = require('./response');
var key = JSON.parse(fs.readFileSync('key.json','utf8'));
const exec = require('child_process').exec;

token = key.token;
admin = key.admin;
my_lord = admin[0];
my_lady = admin[1];

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

		//sending drama update
		bot.onText(/^\/drama$/, response.sendingDramaUpdate);
	};
});

// scheduled job 
// sending photos 
var relax = schedule.scheduleJob('*/10 15 14 * * 1-5', function(){
	console.log("happy time");
	var path = '/mnt/Media/Photos';
	var file_list = fs.readdirSync(path);
	var max = file_list.length;
	var number = Math.floor(Math.random()*max) + 1;
	var photo = path+'/'+file_list[number];
	bot.sendPhoto(my_lord, photo);
});

// sending Drama info
var drama = schedule.scheduleJob('0 0 19 * * *', function(){
	console.log("crawling the webpage");
	const dramaInfo = exec('sh spider_runner.sh', function(){
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
	});
});
