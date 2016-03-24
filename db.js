/*
This default implementation uses redis, sitting on top of NodeRedis
https://github.com/NodeRedis/node_redis?_ga=1.222160667.2024829943.1446679745
*/

// UUID generator, which is a better GUID apparently
var uuid = require('node-uuid');

// set a value against a key
exports.set = function(key, value)
{
  if(config.verbose){
    console.log("setting " + key);
  }

  dbClient.set(key, JSON.stringify(value),function(err){console.log(err)});
}

// push a value on to the start of a list
exports.leftPush = function(key,value)
{
  if(config.verbose){
    console.log("pushing to the left of " + key);
  }

  dbClient.lpush(key, value);
}

// push a value on to the end of a list
exports.rightPush = function(key,value)
{
  if(config.verbose){
    console.log("pushing to the left of " + key);
  }

  dbClient.lpush(key, value);
}

// get a list
exports.listRange = function(key,start,end,callback)
{
  if(config.verbose){
    console.log("getting " + key + " range " + start + ":" + end);
  }

  dbClient.lrange(key,start,end,function(err,reply){callback(reply)});
}

exports.listRemove = function(list,key)
{
  if(config.verbose){
    console.log("deleting " + key + " from " + list);
  }

  dbClient.lrem(list,0,key);
}

// gets an entire list
exports.list = function(key,callback){
  if(config.verbose){
    console.log("getting " + key + " entire range ");
  }

  dbClient.lrange(key,0,-1,function(err,reply){callback(reply)});
}

exports.increment = function(key,callback){
  if(config.verbose){
    console.log("incrementing " + key);
  }

  dbClient.incr(key ,function(err,reply){callback(reply)});
}

// get a value from a key
// callback should accept 1 argument
exports.get = function(key,callback)
{
  if(config.verbose){
    console.log("getting " + key);
  }

  dbClient.get(key, function(err, reply){
    callback(reply);
  })
}

// delete a key
exports.delete = function(key)
{
  if(config.verbose){
    console.log("deleting " + key);
  }

  dbClient.del(key);
}

// get all keys
// callback should accept 1 argument
exports.keys = function(prefix, callback)
{
  if(config.verbose){
    console.log("getting keys " + prefix);
  }

  dbClient.keys(prefix, function(err, replies){
    callback({keys:replies});
  });
}

// generate a new UUID
exports.newId = function(){return uuid.v1();}

// initialize the database and open a connection
exports.init = function(){
  if(config.verbose){
    console.log("Initializing DB");
  }

  dbClient = require('redis').createClient({host:config.databaseHost, port:config.databasePort});

  if(config.verbose){
    console.log("Authenticating DB");
  }
  dbClient.auth(config.databasePassword);

  dbClient.on('error', function (err) {
    console.log('Error ' + err);
  });
}

// close the connection
exports.close = function(){
  if(config.verbose){
    console.log("Closing DB");
  }

  dbClient.quit();
}
