let _ = require('lodash');
let async = require('async');
let debug = require('debug')('ebay-sell-apis:tests:inventory_item');

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
Inventory Item Testing
*/
let product = ebay.inventory.buildProduct({ 
	aspects: 		{
		brand: [ "Patagonia" ]
	},
	title: 			"My Test Item", 
	subtitle: 		"Item from CompeleteSet",
	brand: 			"Marvel", 
	description: 	"This is a test toy", 
	imageUrls: 		[ "http://i.ebayimg.com/images/i/152196556219-0-1/s-9005.jpg" ]
});

// Create a Inventory Item
let sku = "item-" + String( Date.now() )
let item = ebay.inventory.buildItem({
	sku: 					sku,
	condition: 				_.sample( ebay.enums.conditions ),
	conditionDescription:   "Something about the condition",
	availability: 			ebay.inventory.buildAvailability( 1 ),
	packageWeightAndSize:   ebay.inventory.buildPackingAndWeight( "MAILING_BOX", { height: 5.1, width: 5.1, length: 5.1 }, { value: 2.0 }  ),
	product: 				product
});

async.waterfall([
	function( cb ) {
		// Create Inventory Item
		ebay.inventory.item.post( item, function( err, item ) {
			debug("POST inventory.item Response", err, item );
			cb( err );
		})
	},
	function( cb ) {
		// Get Inventory Items
		ebay.inventory.item.get( {}, function( err, items ) {
			debug("GET inventory.item Response", err, items );
			cb( err );
		})
	},
	function( cb ) {
		// Update Inventory Item
		item.sku = sku;
		item.title += " (Updated)";
		ebay.inventory.item.put( item, function( err, item ) {
			debug("PUT inventory.item Response", err, item );
			cb( err );
		})
	},
	function( cb ) {
		// Get Single Inventory Items
		ebay.inventory.item.get( { sku: sku }, function( err, item ) {
			debug("GET Single inventory.item Response", err, item );
			cb( err );
		})
	}
], function( err ){
	if( err ){
		return debug("ERROR", err);
	}
	// Clean up
	ebay.inventory.item.delete( { sku: sku }, function( err, item ) {
		debug("DELETE inventory.item Response", err, item );
	})
});