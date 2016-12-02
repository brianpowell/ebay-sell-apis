let _ = require('lodash');
let async = require('async');
let debug = require('debug')('ebay-sell-apis:tests:inventory_product_compatability');

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
Inventory Offer Testing
*/
let pro_comp = ebay.inventory.buildCompatibleProduct(
	"Equivalent to AC Delco Alternator", 
	ebay.inventory.buildProductFamilyProperties( "Subaru", "DL", "1982", "Base Wagon 4-Door", "1.8L 1781CC H4 GAS SOHC Naturally Aspirated" )
);

let sku = "item-" + String( Date.now() )
let productCompatibility = ebay.inventory.buildProductCompatibility( sku, pro_comp );

// Create a Inventory Item
let item = ebay.inventory.buildItem({
	sku: 					sku,
	condition: 				_.sample( ebay.enums.conditions ),
	conditionDescription:   "Something about the condition",
	availability: 			ebay.inventory.buildAvailability( 1 ),
	packageWeightAndSize:   ebay.inventory.buildPackingAndWeight( "MAILING_BOX", { height: 5.1, width: 5.1, length: 5.1 }, { value: 2.0 }  ),
	// Product
	product: 				ebay.inventory.buildProduct({ 
			title: 			"My Test Item", 
			subtitle: 		"Item from CompeleteSet",
			brand: 			"Marvel", 
			description: 	"This is a test toy", 
			imageUrls: 		[ "http://i.ebayimg.com/images/i/152196556219-0-1/s-9005.jpg" ]
		})
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
		// Get Single Inventory Items
		ebay.inventory.item.get( { sku: sku }, function( err, item ) {
			debug("GET Single inventory.item Response", err, item );
			cb( err );
		})
	},
	function( cb ) {
		// Create Inventory Product Compatability
		ebay.inventory.productCompatibility.post( productCompatibility, function( err, loc ) {
			debug("POST inventory.productCompatibility Response", err, loc );
			cb( err );
		})
	},
	function( cb ) {
		// Get Single Inventory Product Compatability
		ebay.inventory.productCompatibility.get( { sku: sku }, function( err, loc ) {
			debug("GET Single inventory.productCompatibility Response", err, loc );
			cb( err );
		})
	},
	function( cb ) {
		// Update Inventory Product Compatability
		productCompatibility.sku = sku;
		ebay.inventory.productCompatibility.put( productCompatibility, function( err, loc ) {
			debug("PUT inventory.productCompatibility Response", err, loc );
			cb( err );
		})
	},
	function( cb ) {
		// Get Single Inventory Product Compatability
		ebay.inventory.productCompatibility.get( { sku: sku }, function( err, loc ) {
			debug("GET Single inventory.productCompatibility Response", err, loc );
			cb( err );
		})
	}
], function( err ){
	if( err ){
		return debug("ERROR", err);
	}
	// Clean up
	ebay.inventory.productCompatibility.delete( { sku: sku }, function( err, loc ) {
		debug("DELETE inventory.productCompatibility Response", err, loc );
	})
	// Clean up
	ebay.inventory.item.delete( { sku: sku }, function( err, item ) {
		debug("DELETE inventory.item Response", err, item );
	})
});