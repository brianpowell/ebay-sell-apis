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

/*
Inventory Offer Testing
*/
let offer_key = "offer-" + String( Date.now() )
let offer = ebay.inventory.ebay.inventory.buildOffer({
	categoryId: "Test",
	listingDescription: "Listing Description...",
	listingPolicies: {},
	merchantLocationKey: "",
	pricingSummary: {},
	sku: "test",
	storeCategoryNames: [],
	tax: {}
});

// Create Location
// Create Item
// CRUD Offer
// Delete Item
// Delete Location

async.waterfall([
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
		// Update Inventory Offers
		offer.offer_id = offer_key;
		offer.title += " (Updated)";
		ebay.inventory.offer.put( offer, function( err, loc ) {
			debug("PUT inventory.offer Response", err, loc );
			cb( err );
		})
	},
	function( cb ) {
		// Get Single Inventory Offer
		ebay.inventory.offer.get( { offer_id: offer_key }, function( err, loc ) {
			debug("GET Single inventory.offers Response", err, loc );
			cb( err );
		})
	},
	function( cb ) {
		// Publish Inventory Offer
		ebay.inventory.offer.publish.post( { offer_id: offer_key }, function( err, loc ) {
			debug("GET Single inventory.offers Response", err, loc );
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
});