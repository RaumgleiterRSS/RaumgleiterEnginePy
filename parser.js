var parseString = require('xml2js').parseString;
var http = require('http');
var https = require('https');

class Parser {
  static parseFeed(url, callback) {
    this.readUrl(url, function(err, res){
      if (!err) {
        parseString(res, {async: false}, callback);
      } else {
        callback(err);
      }
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
}

module.exports = Parser;