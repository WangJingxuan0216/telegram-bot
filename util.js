module.exports = {
	saveToDB: function(msg, collect) {
		var MongoClient = require('mongodb').MongoClient;
		var assert = require('assert');
		var ObjectId = require('mongodb').ObjectID;
		var url = 'mongodb://localhost:27017/'+collect;
		
		var insertDocument = function(db, message, callback) {
			db.collection(collect).insertOne(message, function(err, result) {
				assert.equal(err, null);
				console.log("Inserted a document into the "+collect+" collections.");
				callback();
			});
		};

		MongoClient.connect(url, msg, function(err, db){
			assert.equal(null, err);
			insertDocument(db, msg, function() {
				db.close();
			});
		});
	}
};