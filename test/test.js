Collection = require('../collection.js');
Parser = require('../parser.js');
Aggregator = require('../aggregator.js');

var assert = require('chai').assert;

describe('Collection', function() {
  describe('#insertOne()', function () {
    it('should insert a document', function () {
      var TestCollection = new Collection('TestCollection');
      TestCollection.insertOne({test: true}, function(res){
        assert.deepPropertyVal(res, 'result.ok', 1);
      });
    });
  });

  describe('#findOne()', function () {
    it('should find the previously inserted document', function () {
      var TestCollection = new Collection('TestCollection');
      TestCollection.findOne({test: true}, function(res){
        assert.deepPropertyVal(res, 'test', true);
      });
    });
  });

  describe('#deleteOne()', function () {
    it('should delete the previously inserted document', function () {
      var TestCollection = new Collection('TestCollection');
      TestCollection.deleteOne({test: true}, function(res){
        assert.deepPropertyVal(res, 'result.ok', 1);
      });
    });
  });
});

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

describe('Aggregator', function() {
  describe('#addFeed()', function () {
    it('should return an Error when url is not a RSS feed', function () {
      Aggregator.addFeed('http://github.com/RaumgleiterRSS/RaumgleiterEngine', function(err, res){
        assert.isNotNull(err);
      });
    });
  });
});
