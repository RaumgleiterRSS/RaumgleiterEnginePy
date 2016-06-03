var Collection = require('./collection.js');
var Parser = require('./parser.js');

var Feeds = new Collection('Feeds');

class Aggregator {
  static addFeed(url, callback) {
    callback = callback || function(){};

    Feeds.findOne({url: url}, function(err, res){
      if (err) {
        callback(err);
        return;
      }

      if (!res) {
        Parser.parseFeed(url, function(err, feed){
          if (err) {
            callback(err);
            return;
          }

          if (!!feed.feedUrl) {
            feed.feedUrl = url;
          }

          Feeds.insertOne(feed, function(err, res){
            if (err) {
              callback(err);
              return;
            }

            callback(null, res);
          });
        });
      } else {
        callback(null, res);
      }
    });
  }

  static updateFeeds(callback) {
    Feeds.find({}, function(err, res){
      if (err) {
        callback(err);
        return;
      }

      res.forEach(function(feed){
        Parser.parseFeed(feed.feedUrl, function(err, updateFeed){
          if (err) {
            callback(err);
            return;
          }

          updateFeed.entries.forEach(function(entry){
            Feeds.updateOne({_id: feed._id}, {
              $addToSet: {
                entries: entry
              }
            });
          });

          callback(null, feed);
        });
      });
    });
  }

  static getFeeds(filters, callback) {
    if (!callback) {
      callback = filters;
      filters = {};
    }

    Feeds.find(filters, callback);
  }
}

module.exports = Aggregator;