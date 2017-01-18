let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:inventory_item');

// Inventory
module.exports = function( enums ) {

    /* 
        Item - MAIN 
        Build structure of an Item
        You can pass in the "availability", "packageWeightAndSize", and "product" as either separate params or within the main "item" param
    */
    function _buildItem( item, availability, packageWeightAndSize, product ) {

        if( !item.sku || !item.condition ) {
            debug("Missing Required Param (buildItem)!!!");
            debug(" > sku", item.sku);
            debug(" > condition", item.condition);
            return false;
        }

        // Check enum values
        if( !_.includes( enums.conditions, String( item.condition ).toUpperCase() ) ) {
            debug("Unsupported condition", item.condition)
            return false;
        }

        // Handoffs for extending
        if ( !item.availability && availability ) {
            item.availability = availability;
        }
        if ( !item.packageWeightAndSize && packageWeightAndSize ) {
            item.packageWeightAndSize = packageWeightAndSize;
        }
        if ( !item.product && product ) {
            item.product = product;
        }

        return _.extend({
                "availability":         {},
                "condition":            item.condition || "",
                "conditionDescription": "",
                "packageWeightAndSize": {},
                "product":              {},
                "sku":                  ""
            }, item );
    }

    /* 
        Availability 
        Build the Availability Node of Items
        This will eventually be used to define the location and type of availaiblity for the items
        RIGHT NOW: it just formats the shipping information for the location delviery
    */
    function _buildAvailability( ship_quantity ){

        return { 
            "pickupAtLocationAvailability": [
             /* This is not yet available from eBay */
                // {
                // "availabilityType": string,
                // "fulfillmentTime":
                //     { 
                //     "unit": string,
                //     "value": integer
                //     },
                // "merchantLocationKey": string,
                // "quantity": integer
                // }
              ],
            "shipToLocationAvailability":
                { 
                "quantity": parseInt( ship_quantity )
                }
            }
    }

    /* 
        Packaging & Weight
        Build the Packaging & Weight Node of Items
        Defaults
            dimension.unit = "INCH"
            weight.unit = "POUND"

        Examples:
        dimensions  = { "height": 0.0, "length": 0.0, "unit": "INCH", "width": 0.0 }
        weight      = { "unit": "POUND", "value": 0.0 }
    */
    function _buildPackingAndWeight( type, dimensions, weight ){

        // Check enum values
        if( !_.includes( enums.pack_types, String( type ).toUpperCase() ) ) {
            debug("Unsupported packageType", type)
            return false;
        }

         if( dimensions.unit && !_.includes( enums.dimensions, String( dimensions.unit ).toUpperCase() ) ) {
            debug("Unsupported dimensions.unit", dimensions.unit)
            return false;
        }

        if( weight.unit && !_.includes( enums.weights, String( weight.unit ).toUpperCase() ) ) {
            debug("Unsupported weight.unit", weight.unit)
            return false;
        }
            
        // Build response Object
        return { 
            "dimensions":
                _.extend( {  
                    "height": 0.0,
                    "length": 0.0,
                    "unit": "INCH",
                    "width": 0.0
                }, dimensions ),
            "packageType": String(type).toUpperCase(),
            "weight":
                _.extend( { 
                    "unit": "POUND",
                    "value": 0.0
                    }, weight )
            }
    }

    /* 
        Product
        Build the Product Node of Items
    */
    function _buildProduct( product ){

        // Check enum values
        if( !product.title || !product.description ) {
            debug("Missing Required Param (buildProduct)!!!");
            debug(" > Title", product.title);
            debug(" > Description", product.description);
            return false;
        }
            
        // Build response Object
        return _.extend( {
            "aspects": {},
            "brand": "",
            "description": "",
            "ean": [],
            "imageUrls": [],
            "isbn": [],
            "mpn": "",
            "subtitle": "",
            "title": "",
            "upc": []
            }, product )
    }

    // return methods
    return {
        buildItem:              _buildItem,
        buildAvailability:      _buildAvailability,
        buildPackingAndWeight:  _buildPackingAndWeight,
        buildProduct:           _buildProduct
    }
}