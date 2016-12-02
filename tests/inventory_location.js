let _ = require('lodash');
let async = require('async');
let debug = require('debug')('ebay-sell-apis:tests:inventory_location');

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
Inventory Location Testing
*/
let address = ebay.inventory.buildAddress( {
	    "addressLine1": "1415 Central Parkway",
	    "addressLine2": "First Floor",
	    "city": "Cincinnati",
	    "stateOrProvince": "OH",
	    "postalCode": "45214"
});

let loc_key = "location-" + String( Date.now() )
let location = ebay.inventory.buildLocation({
		"merchant_location_key": 	loc_key,
	    "location": 				address,
	    "locationInstructions": 	"Come around back",
	    "name": 					"HQ",
	    "merchantLocationStatus": 	"ENABLED",
	    "locationTypes": 			["WAREHOUSE"],
	    "operatingHours": 			_.map( ebay.enums.days, function(day){ return ebay.inventory.buildHour("operating", day, ebay.inventory.buildInterval( "09:00:00", "18:00:00") );  }),
	    "specialHours": 			[]
});

async.waterfall([
	function( cb ) {
		// Create Inventory Location
		ebay.inventory.location.post( location, function( err, loc ) {
			debug("POST Inventory Location Response", err, loc );
			cb( err );
		})
	},
	function( cb ) {
		// Get Inventory Locations
		ebay.inventory.location.get( {}, function( err, locs ) {
			debug("GET Inventory Locations Response", err, locs );
			cb( err );
		})
	},
	function( cb ) {
		// Update Inventory Location
		location.merchant_location_key = loc_key;
		location.name += " (Updated)";
		ebay.inventory.location.put( location, function( err, loc ) {
			debug("PUT Inventory Locations Response", err, loc );
			cb( err );
		})
	},
	function( cb ) {
		// Get Single Inventory Location
		ebay.inventory.location.get( { merchant_location_key: loc_key }, function( err, loc ) {
			debug("GET Single Inventory Location Response", err, loc );
			cb( err );
		})
	}
], function( err ){
	if( err ){
		return debug("ERROR", err);
	}
	// Clean up
	ebay.inventory.location.delete( { merchant_location_key: loc_key }, function( err, loc ) {
		debug("DELETE Inventory Location Response", err, loc );
	})
});