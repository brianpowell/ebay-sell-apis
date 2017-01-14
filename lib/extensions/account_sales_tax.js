let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:account_sales_tax');

// Account
module.exports = function( enums ) {

	/* 
        Sales TAx - MAIN 
        Build structure of an Sales TAx
        You can pass in the "countryCode" and "jurisdictionId" are implemented here, but pulled into the URL
        Defaults:
        shippingAndHandlingTaxed = false
    */
    function _buildSalesTax( salesTaxPercentage, shippingAndHandlingTaxed ) {

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

    return {
        buildSalesTax: _buildSalesTax
    }
}