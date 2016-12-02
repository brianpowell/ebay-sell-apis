let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:main');
let Builder = require('./helpers/builder.js');
let Request = require('./helpers/request.js');
let Extensions = require('./extensions');

// Build out API
function eBay( config, callback ) {

	let ebay = this;

	ebay._config = _.extend({
		clientid: 		"",
		secret: 		"",
		runame:  		"",
		access_token: 	"",
		staging: 		false,
		auto_refesh: 	true,
		setup: 			false
	}, config );

	if( !ebay._config.access_token && ( ebay._config.clientid && ebay._config.secret && ebay._config.runame ) ) {
		
		debug("Going to get an Auth Token");
		ebay.accessToken();
	
	}

	// Attach the request information, since we have an Auth token aleady
	ebay.request = new Request( ebay._config.access_token, ebay._config.staging );

	debug("Ebay building with config: ", ebay._config)

	// Builder
	ebay.builder = new Builder()

	// Extensions
	ebay.extensions = new Extensions()

	// ENUM values
	ebay["enums"] = require('./extensions/enums.json');

	// Common Functions
	ebay["common"] = {};
	ebay.extensions.extend( ebay, "common" );

	// Build out Inventory
	let libs = ["account", "fulfillment", "inventory", "marketing"];
	_.each( libs, function( name ){
		ebay.builder.build( ebay, name, ebay.request );
	})

	return ebay
}

eBay.prototype.setAccessToken = function ( access_token ) {

	let ebay = this;
	ebay._config.access_token = access_token;
	ebay.request.setToken( access_token );

}

module.exports = eBay