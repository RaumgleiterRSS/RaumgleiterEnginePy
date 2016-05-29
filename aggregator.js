var Collection = require('./collection.js');
var Parser = require('./parser.js');

var Feeds = new Collection('Feeds');

var Aggregator = {
  addFeed: function(url) {
    Feeds.findOne({url: url}, function(result){
      if (!result) {
        Parser.parseFeed(url, function(err, json){
          if (!!err) {
            throw new Error('Invalid feed URL');
          }

          var feed = {
            title: json.feed.title[0],
            url: url
          };
          Feeds.insertOne(feed);
        });
      }
    });
  }
};

module.exports = Aggregator;
