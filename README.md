# express-boilerplate

A simple MVC structure sat on top of [express](http://expressjs.com/), with common website functionality implemented without complexity.

## Installation

* [Download](https://github.com/CraigLager/express-boilerplate/archive/master.zip) and extract the zip
* Run `npm install`
* Configure /config/app.dev.config.js and /config/app.production.config.js
    * *You can just copy app.example.config and rename the files to achieve this. Anyone familiar with wordpress should be familiar with this sort of configuration.*
    * *These files are in the .gitignore to stop the accidental uploading of passwords to public git repos. If you're publishing through something like heroku which gets its files from git, you'll need a private repo or your settings put into environment variables.*
* `npm start` to start the webserver
* test on `localhost:3000`

## Basic features
* Straighforward MVC template
* Easy bundle configuration and access through global `bundle` variable.
* Easy database access through a repository model accessed through global `db` variable, with Redis implemented by default
* Easy environment tailored configuration with custom settings accessed through global `config` variable
* Automatically registered routes
* Unobtrusive ajax ready
* Compression ready
* Helper client side functions included
* Vash view engine by default (instead of Jade)
* SSL ready

## MVC Structure
Out of the box, express does not have a "traditional" MVC file structure. This boilerplate attempts to change this to allow easier transition from other languages and expose a more "obvious" architecture.

#### /models
Since /node_moduels is not checked in to version control, a location needed to be created for modules and data driven models.

#### /views
Express uses Jade by default. This has been changed to Vash but it's very easy to change to a view engine of your choosing via npm and changing `app.js`. Vash is basically Razor for Node - so anyone with asp.net MVC experience should feel much more at home.

#### /controllers
All controller files get registered to most suitable routes. `/tests.js` will apply to the route `/tests`, whereas `/index.js` will apply to the route `/``

## Database access
A `db` variable is available globally. It's expects to be used in a nosql pattern (redis is implemented by default using [NodeRedis](https://github.com/NodeRedis/node_redis?_ga=1.222160667.2024829943.1446679745)) and has the following methods available for general access:

* get(key,callback) - gets a key and passes it into the callback function as a JSON object
* set(key,value) - sets a value
* delete(key) - deletes a key
* keys(prefix, callback) - gets all keys matching the prefix, then passes the list of keys into a callback
* newid() - generates a new UUID

Also available for application start and application end are:

* init() - opens a connection
* close() - closes the connection

These are already hooked into app.js, but may need to be changed depending on configuration.

## Configuration

### app.config
An `app.example.config.js` file is included which needs to be cloned and modified into `app.dev.config.js` and `app.production.config.js` The production and dev files are ignored with .gitignore by default. The settings are documented inside the file.

A global `config` variable is made available for access to the settings.

### bundle.config
[express-simple-bundler](https://www.npmjs.com/package/express-simple-bundler) is used to create CSS and JS bundles. The `bundle.config` file should provide the settings for the bundler.

A global `bundle` variable is made available for accessing bundles.

### db.js
Easy to modify and access database repository. Configured by default to use redis, but the methods can be re-written or the module entirely replaced.

A global `db` variable is made available for accessing the database.
