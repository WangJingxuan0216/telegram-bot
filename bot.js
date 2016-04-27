var TelegramBot = require('node-telegram-bot-api');
var fs = require('fs');
var response = require('./response');
var key = JSON.parse(fs.readFileSync('key.json','utf8'));

token = key.token;
admin = key.admin;

bot = new TelegramBot(token, {polling: true});

console.log("bot server started...");

//say hello to user
bot.onText(/^\/hello (.+)$/, response.hello);

//saving password for user
bot.onText(/^\/pw (.+)$/, response.passwordSaving);

//retrieving password for user 
bot.onText(/^\/pwget (.+)$/, response.passwordRetrieving);