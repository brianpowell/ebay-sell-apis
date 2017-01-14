let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:marketing_promotion');

// Marketing
module.exports = function( enums ) {

	/*
        Promotion - MAIN 
        Build structure of an Ad From Inventory Reference
        Default:
            marketPlaceId = "EBAY-US"
    */
    function _buildPromotion ( promo, discountRules, inventoryCriterion ) {

    	if( promo.promotionStatus && !_.includes( enums.promotion_status, String( promo.promotionStatus ).toUpperCase() ) ) {
            debug("Unsupported promo.promotionStatus", promo.promotionStatus)
            return false;
        }

    	if( !promo.name || !promo.condition ) {
            debug("Missing Required Param (buildPromotion)!!!");
            debug(" > name", promo.name);
            debug(" > condition", promo.condition);
            return false;
        }

       if( promotionStatus != "DRAFT" ) {
       		if( !promo.promotionImageUrl || !promo.startDate || !promo.endDate ) {
	            debug("Missing Required Param (buildPromotion)!!!");
	            debug(" > promotionImageUrl", promo.promotionImageUrl);
	            debug(" > startDate", promo.startDate);
	            debug(" > endDate", promo.endDate);
	            return false;
	        }
        }

        // Handoffs for extending
        if ( !promo.discountRules && discountRules ) {
            promo.discountRules = discountRules;
        }
        if ( !promo.inventoryCriterion && inventoryCriterion ) {
            promo.inventoryCriterion = inventoryCriterion;
        }

        if( promo.marketplaceId && !_.includes( enums.marketplace_ids, String( promo.marketplaceId ).toUpperCase() ) ) {
            debug("Unsupported promo.marketplaceId", promo.marketplaceId)
            return false;
        }

        if( promo.priority && !_.includes( enums.marketplace_ids, String( promo.priority ).toUpperCase() ) ) {
            debug("Unsupported promo.priority", promo.priority)
            return false;
        }

        return _.extend({
				"description": "",
				"discountRules": [],
				"endDate": string,
				"inventoryCriterion": {},
				"marketplaceId": "EBAY-US",
				"name": "",
				"priority": "",
				"promotionImageUrl": "",
				"promotionStatus": "",
				"startDate": ""
				}, promo );
    }


    /* 
        Discount Rule
        Build structure of a Discount Rule
        Default:
        	ruleOrder = 1
    */
    function _buildDiscountRule ( ruleOrder, discountBenefit, discountSpecification ) {

    		
		return {
		    "discountBenefit": discountBenefit || {},
		    "discountSpecification": discountSpecification || {},
		    "ruleOrder": ruleOrder || 1
		    }
	}


	/* 
        Discount Benefit
        Build structure of a Discount Benefit
    */
	function _buildDiscountBenefit ( amountOffItem, amountOffOrder, percentageOffItem, percentageOffOrder ) {

    
		return {
	        "amountOffItem": amountOffItem || "",
	        "amountOffOrder": amountOffOrder || "",
	        "percentageOffItem": percentageOffItem || "",
	        "percentageOffOrder": percentageOffOrder || ""
	        }
	}


	/* 
        Discount Specification
        Build structure of a Discount Specification
        Defaults:
        	minQuantity = 1
        	numberOfDiscountedItems = 1
    */
	function _buildDiscountSpecification ( forEachAmount, forEachQuantity, minAmount ) {

		return {
	        "forEachAmount": forEachAmount || {},
	        "forEachQuantity": integer,
	        "minAmount": minAmount || {},
	        "minQuantity": 1,
	        "numberOfDiscountedItems": 1
	        }
	}


	/* 
        Inventory Criterion
        Build structure of a Inventory Criterion
    */
    function _buildInventoryCriterion ( inventoryCriterionType, listingIds, inventoryItems ) {

    	// Check enum values
        if( !_.includes( enums.inventory_criterion, String( inventoryCriterionType ).toUpperCase() ) ) {
            debug("Unsupported inventoryCriterionType", inventoryCriterionType)
            return false;
        }

	    return { /* InventoryCriterion */
		    "inventoryCriterionType": inventoryCriterionType || "",
		    "inventoryItems": inventoryItems || [],
		    "listingIds": listingIds || []
		    }
	}

    // return methids
    return {
        buildPromotion:             _buildPromotion,
        buildDiscountRule:          _buildDiscountRule,
        buildDiscountBenefit:       _buildDiscountBenefit,
        buildDiscountSpecification: _buildDiscountSpecification,
        buildInventoryCriterion:    _buildInventoryCriterion
    }  

}