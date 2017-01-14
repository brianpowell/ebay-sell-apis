let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:fulfillment_shipping');

// Fulfillment
module.exports = function( enums ){

	/* 
        Shipping Fulfillment - MAIN 
        Build structure of an Shipping Fulfillment
        You can pass in the "availability", "packageWeightAndSize", and "product" as either separate params or within the main "item" param
    */
	function _buildShippingFulfillment( fulfill, lineItems ) {

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
	}

	/* 
        Line Item
        Build structure of an Line Item
        Defaults:
        	quantity: 1
    */
	function _buildLineItem( lineItemId, quantity ) {

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

    // return methods
    return {
        buildShippingFulfillment:  _buildShippingFulfillment,
        buildLineItem:             _buildLineItem
    }

}