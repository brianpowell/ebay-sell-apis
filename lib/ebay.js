let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:main');
let Builder = require('./helpers/builder.js');
let Request = require('./helpers/request.js');
let Extensions = require('./extensions');

// Build out API
function eBay( token, staging ) {

	debug("Ebay building with Token: ", token)

	let ebay = this;

	// Attach the request information
	ebay.request = new Request( token, staging );

	// Builder
	ebay.builder = new Builder()

	// Extensions
	ebay.extensions = new Extensions()

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

module.exports = eBay