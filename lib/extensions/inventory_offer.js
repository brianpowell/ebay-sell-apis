let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:inventory_offer');
let enums = require('./enums.json');

// Inventory
module.exports = {

    /* 
        Offer - MAIN 
        Build the structure for an Offer
        Defaults:
        	offer.availableQuantity = 1
        	offer.format = "FIXED_PRICE"
        	offer.marketplaceId = "EBAY_US"
    */
    buildOffer: function _buildOffer( offer, listingPolicies, pricingSummary, tax ) {

    	if( !offer.sku || !offer.categoryId || !offer.listingDescription || !offer.merchantLocationKey ) {
            debug("Missing Required Param (buildOffer)!!!");
            debug(" > sku", offer.sku);
            debug(" > categoryId", offer.categoryId);
            debug(" > listingDescription", offer.listingDescription);
            debug(" > merchantLocationKey", offer.merchantLocationKey);
            return false;
        }

        if( offer.marketplaceId && !_.includes( enums.marketplace_ids, String( offer.marketplaceId ).toUpperCase() ) ) {
            debug("Unsupported offer.marketplaceId", offer.marketplaceId)
            return false;
    	}

    	// Handoffs for extending
        if ( !offer.listingPolicies && listingPolicies ) {
            offer.listingPolicies = listingPolicies;
        }
        if ( !offer.pricingSummary && pricingSummary ) {
            offer.pricingSummary = pricingSummary;
        }
        if ( !offer.tax && tax ) {
            offer.tax = tax;
        }

    	return _.extend( {
			"availableQuantity": 1,
			"categoryId": "",
			"format": "FIXED_PRICE",	// only option, at the time to writing this...
			"listingDescription": "",
			"listingPolicies": {},
			"marketplaceId": "EBAY_US",
			"merchantLocationKey": "",
			"pricingSummary": {},
			"sku": "",
			"storeCategoryNames": [],
			"tax": {}
			}, offer );

    },


    /* 
        Listing Policy
        Build structure of a Listing Policy
    */
    buildListingPolicy: function ( fulfillmentPolicyId, paymentPolicyId, returnPolicyId, shippingCostOverrides ) {

        return { 
			"fulfillmentPolicyId": fulfillmentPolicyId || "",
			"paymentPolicyId": paymentPolicyId || "",
			"returnPolicyId": returnPolicyId || "",
			"shippingCostOverrides": shippingCostOverrides || []
			};
    },

    /* 
        Pricing Summary
        Build structure of a Pricing Summary
    */
    buildPricingSummary: function ( originallySoldForRetailPriceOn, pricingVisibility, price, originalRetailPrice, minimumAdvertisedPrice ) {

        return { 
			"minimumAdvertisedPrice": minimumAdvertisedPrice || {},
			"originallySoldForRetailPriceOn": originallySoldForRetailPriceOn || "",
			"originalRetailPrice": pricingVisibility || {},
			"price": price || {},
			"pricingVisibility": pricingVisibility || ""
			};
    },


    /* 
        Shipping Cost Overrides
        Build structure of a Shipping Cost Overrides
        Defaults:
			priority: 1
			shippingServiceType: "DOMESTIC"
    */
    buildShippingCostOverrides: function ( additionalShippingCost, priority, shippingCost, shippingServiceType, surcharge ) {

    	if( !_.includes( enums.shipping_types, String( shippingServiceType ).toUpperCase() ) ) {
            debug("Unsupported shippingServiceType", shippingServiceType)
            return false;
    	}

        return { 
			"additionalShippingCost": additionalShippingCost || {},
			"priority": priority || 1,
			"shippingCost": shippingCost || {},
			"shippingServiceType": shippingServiceType || "DOMESTIC",
			"surcharge": surcharge || {}
			};
    },

    /* 
        Tax
        Build structure of a Tax
    */
    buildTax: function ( vatPercentage, thirdPartyTaxCategory, applyTax ) {

        return {
		    "vatPercentage": vatPercentage || 0.0,
		    "thirdPartyTaxCategory": thirdPartyTaxCategory || "",
		    "applyTax": ( applyTax != undefined ) ? applyTax : true
		    };
    }

}