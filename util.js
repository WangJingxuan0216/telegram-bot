//initial the database setting
function init(collect) {
		MongoClient = require('mongodb').MongoClient;
		assert = require('assert');
		ObjectId = require('mongodb').ObjectID;
		url = 'mongodb://localhost:27017/'+collect;
};

module.exports = {
	// save msg to database-collection
	saveToDB: function(msg, collect, response, callback) {
		init(collect);

		MongoClient.connect(url, msg, function(err, db){
			db.collection(collect).insertOne(msg, function(err, result) {
				assert.equal(null, err);
				console.log("Inserted a document into the "+collect+" collections.");
				callback(response);
				db.close();
			});
		});
	},

	// retrieve data from database-collection
	retrieveDT: function(msg, collect, callback) {
		init(collect);

		MongoClient.connect(url, msg, function(err, db){
			db.collection(collect).findOne(msg, function(err, docs){
				if (docs != null){
					console.log("finding a result in collcetion");
					callback(JSON.stringify(docs[collect]));
				}
				else{
					console.log("Input name is not available");
					callback("Oops, I can't find the name, please check it again!")
				}
				db.close();
			});
		});
	},

	// update data in current database
	updateDT: function(query, msg, collect, response, callback) {
		init(collect);

		MongoClient.connect(url, msg, function(err, db){
			db.collection(collect).update(query, msg, {upsert: true}, function(err, result){
				assert.equal(null, err);
				console.log("Updated a document into the "+collect+" collections.");
				callback(response);
				db.close();
			})
		})
	}
};