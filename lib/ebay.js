let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:main');
let Builder = require('./helpers/builder.js');
let Request = require('./helpers/request.js');
let Extensions = require('./extensions');

// Build out API
function eBay( config, callback ) {

	let ebay = this;

	ebay._config = _.extend({
		client_id: 		"",
		secret: 		"",
		runame:  		"",
		access_token: 	"",
		scope: 			"readwrite", // "read", "readwrite" OR [] of scopes from enums
		staging: 		false,
		// auto_refesh: 	true,
		setup: 			false
	}, config );

	// Attach the request information, since we have an Auth token aleady
	ebay.request = new Request( ebay._config.access_token, ebay._config.staging );

	debug("Ebay building with config: ", ebay._config)

	// ENUM values
	ebay["enums"] = require("./enums.json");

	// Builder
	ebay.builder = new Builder();

	// Extensions
	ebay.extensions = new Extensions();

	// Common Functions
	ebay["common"] = {};
	ebay.extensions.extend( ebay, "common", ebay.enums );

	// Build out Inventory
	let libs = ["account", "fulfillment", "inventory", "marketing"];
	_.each( libs, function( name ){
		ebay.builder.build( ebay, name, ebay.request, ebay.enums );
	})

	return ebay
}

eBay.prototype.getENUMS = function ( key ) {

	let ebay = this;

	if( !key ) {
		return ebay.enums;
	}

	return ebay.enums[key];

}

eBay.prototype.getAuthUrl = function ( state, scop ) {

	let ebay = this;

	let scope = scop || ebay._config.scope;

	debug("config", ebay._config, scope)

	return ebay.request.getAuthUrl( state, scope, ebay._config );

}

eBay.prototype.exchangeCode = function ( code, callback ) {

	let ebay = this;
	ebay.request.exchangeCode( code, ebay._config, callback );

}

eBay.prototype.refreshAccessToken = function ( refesh_token, callback ) {

	let ebay = this;
	ebay.request.refreshToken( refesh_token, ebay._config, callback );

}

eBay.prototype.setAccessToken = function ( access_token ) {

	let ebay = this;
	ebay._config.access_token = access_token;
	ebay.request.setToken( access_token );

}

module.exports = eBay