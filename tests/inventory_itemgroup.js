let _ = require('lodash');
let async = require('async');
let debug = require('debug')('ebay-sell-apis:tests:inventory_itemgroup');

// Pull in Main Lib
let eBay = require('../index.js')

// eBay Config
let ebay_config = {
	access_token: process.env.EBAY_ACCESS_TOKEN,
	staging: ( process.env.EBAY_STAGING ) ? Boolean( process.env.EBAY_STAGING ) : true
}
// Let's Roll!
let ebay = new eBay( ebay_config );

/*
Inventory Image Group Testing
*/
let variesBy = [
	ebay.inventory.buildSpecification( "Color", [ "Red", "Green", "Blue" ] ),
	ebay.inventory.buildSpecification( "Size", [ "Small", "Medium", "Large" ], 2)
]

let ig_key = "itemgroup-" + String( Date.now() )
let itemgroup = ebay.inventory.buildItemGroup({
    inventory_item_group_key: 		ig_key,
    description:    				"Item group description...",
    imageUrls:      				[ "http://i.ebayimg.com/images/i/152196556219-0-1/s-9005.jpg" ],
    subtitle:       				"Item Group Sub Title",
    title:          				"Item Group Title",
    variantSKUs:    				[ "123", "456" ],
    variesBy:       				ebay.inventory.buildVariesBy( variesBy )
});

async.waterfall([
	function( cb ) {
		// Create Inventory Image Group
		ebay.inventory.itemGroup.post( itemgroup, function( err, loc ) {
			debug("POST inventory.itemGroup Response", err, loc );
			cb( err );
		})
	},
	function( cb ) {
		// Get Inventory Image Groups
		ebay.inventory.itemGroup.get( {}, function( err, locs ) {
			debug("GET inventory.itemGroup Response", err, locs );
			cb( err );
		})
	},
	function( cb ) {
		// Update Inventory Image Groups
		itemgroup.offer_id = ig_key;
		itemgroup.title += " (Updated)";
		ebay.inventory.itemGroup.put( itemgroup, function( err, loc ) {
			debug("PUT inventory.itemGroup Response", err, loc );
			cb( err );
		})
	},
	function( cb ) {
		// Get Single Inventory Image Group
		ebay.inventory.itemGroup.get( { offer_id: ig_key }, function( err, loc ) {
			debug("GET Single inventory.itemGroups Response", err, loc );
			cb( err );
		})
	}
], function( err ){
	if( err ){
		return debug("ERROR", err);
	}
	// Clean up
	ebay.inventory.itemGroup.delete( { offer_id: ig_key }, function( err, loc ) {
		debug("DELETE inventory.itemGroup Response", err, loc );
	})
});