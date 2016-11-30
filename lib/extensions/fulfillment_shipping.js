let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:fulfillment_shipping');
let enums = require('./enums.json');

// Fulfillment
module.exports = {

	/* 
        Shipping Fulfillment - MAIN 
        Build structure of an Shipping Fulfillment
        You can pass in the "availability", "packageWeightAndSize", and "product" as either separate params or within the main "item" param
    */
	buildShippingFulfillment: function ( fulfill, lineItems ) {

		// Handoffs for extending
        if ( !fulfill.lineItems && lineItems ) {
            fulfill.lineItems = lineItems;
        }

        // Dependent
        if( ( fulfill.shippingCarrierCode && !fulfill.trackingNumber ) || ( !fulfill.shippingCarrierCode && fulfill.trackingNumber ) ) {
        	debug("Missing Dependent Param (buildLineItem)!!!");
            debug(" > fulfill.shippingCarrierCode", fulfill.shippingCarrierCode);
            debug(" > fulfill.trackingNumber ", fulfill.trackingNumber );
            return false;
        }

        if( !_.includes( enums.shipping_carrier_codes, String( fulfill.shippingCarrierCode ) ) ) {
            debug("Unsupported fulfill.shippingCarrierCode", fulfill.shippingCarrierCode)
            return false;
        }

		return _.extend( { /* ShippingFulfillmentDetails */
			"lineItems": [],
			"shippedDate": "",
			"shippingCarrierCode": "",
			"trackingNumber": ""
			}, fulfill );
	},

	/* 
        Line Item
        Build structure of an Line Item
        Defaults:
        	quantity: 1
    */
	buildLineItem: function ( lineItemId, quantity ) {

		if( !lineItemId ) {
            debug("Missing Required Param (buildLineItem)!!!");
            debug(" > lineItemId", lineItemId);
            return false;
        }

		return { 
		    "lineItemId": lineItemId || "",
		    "quantity": quantity || 1
		    }
	}

}