var Aggregator = require('./aggregator.js');

class CLI {
  constructor(args){
    this.args = args;
  }

  handle(){
    var self = this;

    if (this.args.length > 0) {
      switch(this.args[0]){
        case 'list':
          self.handleList();
          break;
        case 'add':
          self.handleAdd();
          break;
        case 'update':
          self.handleUpdate();
        default:
          self.showHelp();
      }
    } else {
      self.showHelp();
    }
  }

  handleList() {
    var self = this;

    if (this.args.length == 2) {
      var param = this.args[1];

      switch(param) {
        case 'subscriptions':
          self.listSubscriptions();
          break;
        case 'feeds':
          self.listFeeds();
          break;
        default:
          self.showHelp();
      }
    } else {
      self.showHelp();
    }
  }

  listSubscriptions() {
    Aggregator.getFeeds({}, function(err, res){
      if (err) return;

      console.log('You have subscribed:');

      res.forEach(function(document){
        console.log(' * ' + document.title);
      });
    });
  }

  listFeeds() {
    Aggregator.getFeeds({}, function(err, res){
      if (err) return;

      console.log('Listing all feeds:');

      res.forEach(function(document){
        console.log(document.title + ':');

        document.entries.forEach(function(item){
          console.log(item);
        });
      });
    });
  }

  handleAdd() {
    var self = this;

    if (this.args.length == 2) {
      var url = this.args[1];

      Aggregator.addFeed(url, function(err, res){
        if (err) {
          console.log(err);
          return;
        }

        console.log(res);
      });
    } else {
      self.showHelp();
    }
  }

  handleUpdate() {
    var self = this;

    if (this.args.length == 2) {
      var param = this.args[1];

      switch(param) {
        case 'subscriptions':
          self.updateSubscriptions();
          break;
        default:
          self.showHelp();
      }
    } else {
      self.showHelp();
    }
  }

  updateSubscriptions() {
    Aggregator.updateFeeds(function(err, res){
      console.log(err);
      console.log(res);
    });
  }

  showHelp() {
    console.log('SHOW HELP');
  }
}

module.exports = CLI;