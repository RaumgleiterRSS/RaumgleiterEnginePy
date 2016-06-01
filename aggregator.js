var Collection = require('./collection.js');
var Parser = require('./parser.js');

var Feeds = new Collection('Feeds');

class Aggregator {
  static addFeed(url, callback) {
    callback = callback || function(){};

    Feeds.findOne({url: url}, function(result){
      if (!result) {
        Parser.parseFeed(url, function(err, json){
          if (!err && !!json) {
            var feed = {
              title: json.feed.title[0],
              url: url
            };
            Feeds.insertOne(feed);

            callback(null, feed);
          } else {
            callback(new Error('Invalid feed URL'));
          }
        });
      }
    });
  }
}

module.exports = Aggregator;