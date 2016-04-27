//initial the database setting
function init(collect) {
		MongoClient = require('mongodb').MongoClient;
		assert = require('assert');
		ObjectId = require('mongodb').ObjectID;
		url = 'mongodb://localhost:27017/'+collect;
};

module.exports = {
	// save msg to database-collection
	saveToDB: function(msg, collect) {
		init(collect);
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
	},
	// retrieve data from database-collection
	retrieveDT: function(msg, collect) {
		init(collect);
		var findData = function(db, message, callback) {
			db.collection(collect).find(message).each(function(err, doc){
				assert.equal(err, null);
				if (doc == null){
					callback();
				}
				console.log(doc);
				return doc;
			});
		};

		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			findData(db, msg, function() {
				db.close();
			});
			
		});

	}
};