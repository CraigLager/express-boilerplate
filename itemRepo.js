/* usage:

var itemRepo = require("./itemRepo");
var repo = new itemRepo("foobar");
repo.get(123,function(){});

 */
function repo(prefix){
  this.prefix = prefix + ":";
  this.list = prefix + "_list";

  this.get = function(id,callback){
    db.get(this.prefix + id,function(model){
      callback(JSON.parse(model));
    });
  }

  this.set = function(item,callback){
    db.set(this.prefix + item.id, item);
    db.leftPush(this.list, item.id);
  }

  this.delete = function(id){
    db.delete(this.prefix + id);
    db.listRemove(this.list,id);
  }

  this.increment = function(id, callback)
  {
    db.increment(this.prefix + id + "_count", callback);
  }

  this.getCount = function(id,callback)
  {
    db.get(this.prefix + id + "_count", function(data){
      callback(data);
    });
  }

  this.getPage = function(itemsPerPage,page,callback)
  {
    var startIndex = itemsPerPage * page - itemsPerPage;
    var endIndex = itemsPerPage * page - 1;
    var _this = this;
    db.listRange(this.list,startIndex,endIndex,function(keys){
        var items = [];
        var async = require('async');
        async.forEachOf(
          keys,
          function(obj,key,callback){
            _this.get(obj, function(item){
              items.push(item);
              return callback();
            }); //db.get
          },
          function(){
            callback(items);
        }); // async.forEachOf
      }); // listRange
  }

  this.getPageKeys = function(itemsPerPage, page, callback)
  {
    var startIndex = itemsPerPage * page - itemsPerPage;
    var endIndex = itemsPerPage * page - 1;
    var _this = this;
    db.listRange(this.list,startIndex,endIndex,function(keys){
        var items = [];
        var async = require('async');
        async.forEachOf(
          keys,
          function(obj,key,callback){
            console.log(obj);
              items.push(obj);
              return callback();
          },
          function(){
            callback(items);
        }); // async.forEachOf
      }); // listRange
  }

}

module.exports = repo;
