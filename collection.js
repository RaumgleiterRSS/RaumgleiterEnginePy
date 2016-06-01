var MongoClient = require('mongodb').MongoClient;
var config = require('./config.js');

class Collection{
  constructor(collectionName){
    var self = this;

    this.collectionName = collectionName;

    MongoClient.connect(config.mongoURL, function(err, db) {
      var collection = db.collection(self.collectionName);

      if (!collection) {
        db.createCollection(self.collectionName, function(collection){
          db.close();
        });
      } else {
        db.close();
      }
    });
  }

  _connect(callback) {
    var self = this;
    MongoClient.connect(config.mongoURL, function(err, db) {
      if (!err) {
        var collection = db.collection(self.collectionName);
        callback(db, collection);
      } else {
        throw err;
      }
    });
  }

  _finish(err, res, db, callback) {
    db.close();
    if (!err) {
      callback(res);
    } else {
      throw new Error(err);
    }
  }

  insertOne(document, callback) {
    var self = this;
    callback = callback || function(){};

    self._connect(function(db, collection) {
      collection.insertOne(document, function(err, result){
        self._finish(err, result, db, callback);
      });
    });
  }

  findOne(query, callback) {
    var self = this;
    callback = callback || function(){};

    self._connect(function(db, collection) {
      collection.findOne(query, function(err, result){
        self._finish(err, result, db, callback);
      });
    });
  }

  find(query, callback) {
    var self = this;
    callback = callback || function(){};

    self._connect(function(db, collection) {
      collection.find(query).toArray(function(err, result){
        self._finish(err, result, db, callback);
      });
    });
  }

  deleteOne(query, callback) {
    var self = this;
    callback = callback || function(){};

    self._connect(function(db, collection) {
      collection.deleteOne(query, function(err, result){
        self._finish(err, result, db, callback);
      });
    });
  }
}

module.exports = Collection;