let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:marketing_ad');

// Marketing
module.exports = function( enums ){

	/*
        Ad From Inventory Reference - MAIN 
        Build structure of an Ad From Inventory Reference
        Default:
    */
    function _buildAdFromInventoryReference ( bidPercentage, inventoryReferenceId, inventoryReferenceType ) {

    	if( !bidPercentage || !inventoryReferenceId || !inventoryReferenceType ) {
            debug("Missing Required Param (buildAdFromInventoryReference)!!!");
            debug(" > bidPercentage", bidPercentage);
            debug(" > inventoryReferenceId", inventoryReferenceId);
            debug(" > inventoryReferenceType", inventoryReferenceType);
            return false;
        }

        return {
		    "bidPercentage": bidPercentage,
		    "inventoryReferenceId": inventoryReferenceId,
		    "inventoryReferenceType": inventoryReferenceType
    		}
    }

    /*
        Ad From Listing ID - MAIN 
        Build structure of an Ad From Listing ID
        Default:
    */
    function _buildAdFromListingId ( bidPercentage, listingId ) {

    	if( !bidPercentage || !listingId ) {
            debug("Missing Required Param (buildAdFromListingId)!!!");
            debug(" > bidPercentage", bidPercentage);
            debug(" > listingId", listingId);
            return false;
        }

        return {
		    "bidPercentage": bidPercentage,
		    "listingId": listingId,
    		}
    }


    return {
        buildAdFromInventoryReference:  _buildAdFromInventoryReference,
        buildAdFromListingId:           _buildAdFromListingId
    }

}