let _ = require('lodash');
let async = require('async');
let debug = require('debug')('ebay-sell-apis:tests:inventory_offer');

// Pull in Main Lib
let eBay = require('../index.js')

// eBay Config
let ebay_config = {
	access_token: process.env.EBAY_ACCESS_TOKEN,
	staging: ( process.env.EBAY_STAGING ) ? Boolean( process.env.EBAY_STAGING ) : true
}
// Let's Roll!
let ebay = new eBay( ebay_config );

// Create a Inventory Item
let sku = "item-" + String( Date.now() )
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

// Create Location
let loc_key = "location-" + String( Date.now() )
let location = ebay.inventory.buildLocation({
		"merchant_location_key": 	loc_key,
	    "location": 				ebay.inventory.buildAddress( {
											    "addressLine1": "500 West Fifth St",
											    "city": "Cincinnati",
											    "stateOrProvince": "OH",
											    "postalCode": "45214"
											}),
	    "locationInstructions": 	"See the front desk",
	    "name": 					"HQ",
	    "merchantLocationStatus": 	"ENABLED",
	    "locationTypes": 			["WAREHOUSE"],
	    "operatingHours": 			_.map( ebay.enums.days, function(day){ return ebay.inventory.buildHour("operating", day, ebay.inventory.buildInterval( "09:00:00", "18:00:00") );  }),
	    "specialHours": 			[]
});

/*
Inventory Offer Testing
*/
let offer_key = "offer-" + String( Date.now() )
let offer = ebay.inventory.buildOffer({
	categoryId: "178086",
	listingDescription: "Listing Description...",
	listingPolicies: {},
	merchantLocationKey: loc_key,
	pricingSummary: ebay.inventory.buildPricingSummary( ebay.common.buildAmount( 5.99 ) ),
	sku: sku,
	tax: {}
});

// Create Location
// Create Item
// CRUD Offer
// Delete Item
// Delete Location

async.waterfall([
	function( cb ) {
		// Create Inventory Location
		ebay.inventory.location.post( location, function( err, loc ) {
			debug("POST Inventory Location Response", err, loc );
			cb( err );
		})
	},
	function( cb ) {
		// Create Inventory Item
		ebay.inventory.item.post( item, function( err, item ) {
			debug("POST inventory.item Response", err, item );
			cb( err );
		})
	},
	function( cb ) {
		// Create Inventory Offer
		ebay.inventory.offer.post( offer, function( err, loc ) {
			debug("POST inventory.offer Response", err, loc );
			cb( err );
		})
	},
	function( cb ) {
		// Get Inventory Offers
		ebay.inventory.offer.get( {}, function( err, locs ) {
			debug("GET inventory.offer Response", err, locs );
			cb( err );
		})
	},
	function( cb ) {
		// Update Inventory Offer
		offer.offer_id = offer_key;
		offer.listingDescription += " (Updated)";
		ebay.inventory.offer.put( offer, function( err, loc ) {
			debug("PUT inventory.offer Response", err, loc );
			cb( err );
		})
	},
	function( cb ) {
		// Get Single Inventory Offer
		ebay.inventory.offer.get( { offer_id: offer_key }, function( err, loc ) {
			debug("GET Single inventory.offer Response", err, loc );
			cb( err );
		})
	},
	function( cb ) {
		// Publish Inventory Offer
		ebay.inventory.offer.publish.post( { offer_id: offer_key }, function( err, loc ) {
			debug("POST Publish inventory.offer Response", err, loc );
			cb( err );
		})
	}
], function( err ){
	if( err ){
		return debug("ERROR", err);
	}
	// Clean up
	ebay.inventory.offer.delete( { offer_id: offer_key }, function( err, loc ) {
		debug("DELETE inventory.offer Response", err, loc );
	})
	ebay.inventory.item.delete( { sku: sku }, function( err, item ) {
		debug("DELETE inventory.item Response", err, item );
	})
	ebay.inventory.location.delete( { merchant_location_key: loc_key }, function( err, loc ) {
		debug("DELETE Inventory Location Response", err, loc );
	})
});