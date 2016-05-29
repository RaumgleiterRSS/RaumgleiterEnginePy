Parser = require('../parser.js').Parser;
var assert = require('chai').assert;

describe('Parser', function() {
  describe('#readUrl()', function () {
    it('should throw Error when url is not an URL', function () {
      assert.throws(function() {
        Parser.readUrl('www.google');
      }, Error, 'Unable to determine the domain name');
    });
    it('should handle redirects', function () {
      Parser.readUrl('http://github.com/RaumgleiterRSS/RaumgleiterEngine', function (result) {
        assert.include(result, 'RaumgleiterEngine');
      });
    });
  });
  describe('#parseFeed()', function () {
    it('feed should contain keys \'rss\' and \'rss.channel\'', function () {
      Parser.parseFeed('https://github.com/RaumgleiterRSS/RaumgleiterEngine/commits/master.atom', function(result){
        assert.property(result, 'rss');
        assert.deepProperty(result, 'rss.channel');
      });
    });
  });
});
