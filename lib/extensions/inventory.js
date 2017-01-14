let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:inventory');

module.exports = function( enums ) {
	// Pull in Sub libs
	let item 		= require('./inventory_item.js')( enums );
	let itemgroup 	= require('./inventory_itemgroup.js')( enums );
	let location 	= require('./inventory_location.js')( enums );
	let offer 		= require('./inventory_offer.js')( enums );
	let comp        = require('./inventory_product_compatibility.js')( enums );


	// Put all the inventory together
	return _.extend( {}, item, itemgroup, location, offer, comp );
}