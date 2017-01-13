let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:account_fulfillment');

// Account
module.exports = function( enums ) {

	/*
        Fulfillment Policy - MAIN 
        Build structure of an Fulfillment Policy
        Default:
            freightShipping = false
            globalShipping =  false
            localPickup = false
            pickupDropOff = false
    */
    function _buildFulfillmentPolicy( fulfill, handlingTime, fullPaymentDueIn, paymentMethods ) {

    	if( !fulfill.name || !fulfill.condition ) {
            debug("Missing Required Param (buildItem)!!!");
            debug(" > name", fulfill.name);
            debug(" > condition", fulfill.condition);
            return false;
        }

        // Handoffs for extending
        if ( !fulfill.handlingTime && handlingTime ) {
            fulfill.handlingTime = handlingTime;
        }
        if ( !fulfill.fullPaymentDueIn && fullPaymentDueIn ) {
            fulfill.fullPaymentDueIn = fullPaymentDueIn;
        }
        if ( !fulfill.paymentMethods && paymentMethods ) {
            fulfill.paymentMethods = paymentMethods;
        }

        if( fulfill.marketplaceId && !_.includes( enums.marketplace_ids, String( fulfill.marketplaceId ).toUpperCase() ) ) {
            debug("Unsupported fulfill.marketplaceId", fulfill.marketplaceId)
            return false;
        }

        return _.extend( {
				"categoryTypes": [],
				"description": "",
				"freightShipping": false,
				"globalShipping": false,
				"handlingTime": {},
				"localPickup": false,
				"marketplaceId": "",
				"name": "",
				"pickupDropOff": false,
				"shippingOptions": [],
				"shipToLocations":
				    { /* RegionSet */
				    "regionExcluded": [
				        { /* Region */
				        "regionName": string,
				        "regionType": string
				        }
				        /* More Region nodes here */
				      ],
				    "regionIncluded": [
				        { /* Region */
				        "regionName": string,
				        "regionType": string
				        }
				        /* More Region nodes here */
				      ]
				    }
				}, fulfill );
    }

    /* 
        Shipping Options
        Build structure of a Shipping Options
        Defaults:
            insuranceOffered = false
    */
    function _buildShippingOptions( costType, optionType, insuranceOffered, insuranceFee, packageHandlingCost, shippingServices ) {

    	if( !_.includes( enums.cost_type, String( costType ).toUpperCase() ) ) {
            debug("Unsupported costType", costType)
            return false;
        }

        if( !_.includes( enums.shipping_types, String( optionType ).toUpperCase() ) ) {
            debug("Unsupported optionType", optionType)
            return false;
        }

        return { 
		    "costType": costType,
		    "insuranceFee": insuranceFee || {},
		    "insuranceOffered": false,
		    "optionType": optionType,
		    "packageHandlingCost": packageHandlingCost || {},
		    "shippingServices": shippingServices || []
		    }
    }


    /* 
        ShippingService
        Build structure of a ShippingService
        Defaults:
            insuranceOffered = false
            buyerResponsibleForPickup = false
            buyerResponsibleForShipping = false
            freeShipping = false
            sortOrder = 1
    */
    function _buildShippingService( ship, additionalShippingCost, cashOnDeliveryFee, shippingCost, shipToLocations, surcharge ) {

    	if( ship.shippingCarrierCode && !_.includes( enums.shipping_carrier_codes, String( ship.shippingCarrierCode ) ) ) {
            debug("Unsupported ship.shippingCarrierCode", ship.shippingCarrierCode)
            return false;
        }

        // Handoffs for extending
        if ( !ship.additionalShippingCost && additionalShippingCost ) {
            ship.additionalShippingCost = additionalShippingCost;
        }
        if ( !ship.cashOnDeliveryFee && cashOnDeliveryFee ) {
            ship.cashOnDeliveryFee = cashOnDeliveryFee;
        }
        if ( !ship.shippingCost && shippingCost ) {
            ship.shippingCost = shippingCost;
        }
        if ( !ship.shipToLocations && shipToLocations ) {
            ship.shipToLocations = shipToLocations;
        }
        if ( !ship.surcharge && surcharge ) {
            ship.surcharge = surcharge;
        }
          
        return _.extend({
	        "additionalShippingCost": {},
	        "buyerResponsibleForPickup": false,
	        "buyerResponsibleForShipping": false,
	        "cashOnDeliveryFee": {},
	        "freeShipping": false,
	        "shippingCarrierCode": "",
	        "shippingCost": {},
	        "shippingServiceCode": "",
	        "shipToLocations": {},
	        "sortOrder": 1,
	        "surcharge": {}
	        }, ship );
	}


	/* 
        ShipToLocation
        Build structure of a ShipToLocation
        Defaults:
            insuranceOffered = false
    */
    function _buildShipToLocation( regionExcluded, regionIncluded ) {


    	return { 
            "regionExcluded": regionExcluded || [],
            "regionIncluded": regionIncluded || []
            }

    }

    // return methods
    return {
        buildFulfillmentPolicy: _buildFulfillmentPolicy,
        buildShippingOptions:   _buildShippingOptions,
        buildShippingService:   _buildShippingService,
        buildShipToLocation:    _buildShipToLocation
    }

}