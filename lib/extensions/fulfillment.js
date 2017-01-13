let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:fulfillment');

module.exports = function( enums ) {
	// Pull in Sub libs
	let shipping 	= require('./fulfillment_shipping.js')( enums );
		
	return _.extend( {}, shipping );
}