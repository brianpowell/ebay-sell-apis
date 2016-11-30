let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:account_sales_tax');
let enums = require('./enums.json');

// Account
module.exports = {

	/* 
        Sales TAx - MAIN 
        Build structure of an Sales TAx
        You can pass in the "countryCode" and "jurisdictionId" are implemented here, but pulled into the URL
        Defaults:
        shippingAndHandlingTaxed = false
    */
    buildSalesTax: function( salesTaxPercentage, shippingAndHandlingTaxed ) {

        if( !salesTaxPercentage ) {
            debug("Missing Required Param (buildSalesTax)!!!");
            debug(" > salesTaxPercentage", salesTaxPercentage);
            return false;
        }

        return { /* SalesTaxBase */
			"salesTaxPercentage": string,
			"shippingAndHandlingTaxed": (shippingAndHandlingTaxed != undefined) ? shippingAndHandlingTaxed : false
			}
    }

}