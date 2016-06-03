var parseString = require('xml2js').parseString;
var http = require('http');
var https = require('https');

class Parser {
  static parseFeed(url, callback) {
    var self = this;

    this.readUrl(url, function(err, res){
      if (err) callback(err);

      parseString(res, {async: false}, function(err, res){
        if (err) callback(err);

        // ATOM-Format
        if (res.feed) {
          self.parseAtom(res, callback);
          return;
        }
        callback(new Error('Not implemented yet!'));
      });
    });
  }

  static readUrl(url, callback) {
    var self = this;
    var handle = null;

    if (url.indexOf('https:') === 0) {
      handle = https;
    } else {
      handle = http;
    }

    var request = handle.get(url, function (response) {
      if (response.statusCode === 200) {
        var str = '';

        response.on('data', function (chunk) {
          str += chunk;
        });

        response.on('end', function () {
          callback(null, str);
        });
      } else {
        if ((response.statusCode === 301 || response.statusCode === 302) &&
            (!!response.headers && !!response.headers.location)) {
          var url = response.headers.location;
          self.readUrl(url, callback);
        } else {
          callback(new Error('Invalid URL'));
        }
      }
    }).on('error', function(e) {
      callback(e);
    });
  }

  static parseAtom(res, callback) {
    var feed = {};

    if (res.feed.title) {
      feed.title = res.feed.title[0];
    }

    if (res.feed.link) {
      if (res.feed.link[0] && res.feed.link[0].$.href) {
        feed.link = res.feed.link[0].$.href;
      }
      if (res.feed.link[1] && res.feed.link[1].$.href) {
        feed.feedUrl = res.feed.link[1].$.href;
      }
    }

    var entries = res.feed.entry || [];

    feed.entries = [];

    entries.forEach(function(item){
      var entry = {};

      if (item.id) {
        entry.id = item.id[0];
      }

      if (item.link) {
        entry.link = item.link[0].$.href;
      }

      if (item.title){
        entry.title = item.title[0];
      }

      if (item.updated){
        entry.updated = item.updated[0];
      }

      if (item.content) {
        if (typeof item.content[0]._ === 'string') {
          entry.content = item.content[0]._;
        } else {
          // TODO: implement for other feed types
          entry.content = item.content;
        }
      }

      feed.entries.push(entry);
    });

    callback(null, feed);
  }
}

module.exports = Parser;