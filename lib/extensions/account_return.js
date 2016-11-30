let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:account_returrn');
let enums = require('./enums.json');

// Account
module.exports = {

	/* 
        Return Policy - MAIN 
        Build structure of a Return Policy
        Defaults:
        	extendedHolidayReturnsOffered = false
        	returnsAccepted = false
        	returnShippingCostPayer = "BUYER"
    */
	buildReturnPolicy: function ( returnPolicy ) {


		if( !returnPolicy.name || !returnPolicy.marketplaceId ) {
            debug("Missing Required Param (buildReturnPolicy)!!!");
            debug(" > name", returnPolicy.name);
            debug(" > marketplaceId", returnPolicy.marketplaceId);
            return false;
        }

		// Handoffs for extending
        if ( !returnPolicy.lineItems && lineItems ) {
            returnPolicy.lineItems = lineItems;
        }

        if( !_.includes( enums.marketplace_ids, String( returnPolicy.shippingCarrierCode ) ) ) {
            debug("Unsupported returnPolicy.shippingCarrierCode", returnPolicy.shippingCarrierCode)
            return false;
        }

         if( returnPolicy.returnShippingCostPayer && !_.includes( enums.return_payer, String( returnPolicy.returnShippingCostPayer ) ) ) {
            debug("Unsupported returnPolicy.returnShippingCostPayer", returnPolicy.returnShippingCostPayer)
            return false;
        }

		return _.extend( {
			"categoryTypes": [],
			"description": "",
			"extendedHolidayReturnsOffered": false,
			"marketplaceId": "",
			"name": "",
			"refundMethod": "",
			"restockingFeePercentage": "",
			"returnInstructions": "",
			"returnMethod": "",
			"returnPeriod": {},
			"returnsAccepted": false,
			"returnShippingCostPayer": "BUYER"
			}, returnPolicy );
	}

}