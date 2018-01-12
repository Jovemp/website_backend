var restful = require('node-restful');
var mongoose = restful.mongoose;
var config = require("./config_db.js");

module.exports = function(app) {

	mongoose.connect(`mongodb://${config.host}/${config.database}`);
	return mongoose;
    
};