var Parser = {
  parseFeed: function(url, callback) {
    this.readUrl(url, function(data){
      var parseString = require('xml2js').parseString;

      parseString(data, function (err, result) {
        callback(result);
      });
    });
  },

  readUrl: function readUrl(url, callback) {
    var http = null;

    if (url.indexOf('https:') === 0) {
      http = require('https');
    } else {
      http = require('http');
    }

    var handleResponse = function(response, callback) {
      if (!!response.headers && !response.headers.location) {
        fetchContent(response, callback);
      } else {
        if (!!response.headers.location) {
          var url = response.headers.location;

          if (url.indexOf('https:') === 0) {
            http = require('https');
          } else {
            http = require('http');
          }

          var request = http.get(url, function (response) {
            handleResponse(response, callback);
          });

          request.end();
        } else {
          throw new Error('Unknown response');
        }
      }
    };

    var fetchContent = function(response, callback) {
      var str = '';

      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        callback(str);
      });
    };

    var request = http.get(url, function (response) {
      handleResponse(response, callback);
    });

    request.end();
  }
};

exports.Parser = Parser;
