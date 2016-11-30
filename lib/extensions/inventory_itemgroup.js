let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:inventory_itemgroup');
let enums = require('./enums.json');

// Inventory
module.exports = {

	/* 
        ItemGroup - MAIN 
        Build structure of an Item
        You can pass in the "imageUrls", "packageWeightAndSize", and "product" as either separate params or within the main "item" param
    */
    buildItemGroup: function( itemGroup, variantSKUs, variesBy ) {

        if( !itemGroup.inventoryItemGroupKey || !itemGroup.title  ) {
            debug("Missing Required Param (buildItemGroup)!!!");
            debug(" > Title", itemGroup.title);
            debug(" > inventoryItemGroupKey", itemGroup.inventoryItemGroupKey);
            return false;
        }

        // Handoffs for extending
        if ( !itemGroup.variantSKUs && variantSKUs ) {
            itemGroup.variantSKUs = variantSKUs;
        }
        if ( !itemGroup.variesBy && variesBy ) {
            itemGroup.variesBy = variesBy;
        }

        return _.extend( {
            "aspects":                  {},
            "description":              "",
            "imageUrls":                [],
            "inventoryItemGroupKey":    "",
            "subtitle":                 "",
            "title":                    "",
            "variantSKUs":              [],
            "variesBy":                 []
            }, itemGroup );
    },

    /* 
        VariesBy
        Build structure of an Item
        You can pass in the "availability", "packageWeightAndSize", and "product" as either separate params or within the main "item" param
    */
    buildVariesBy: function ( specifications ) {

        return {
            "aspectsImageVariesBy": _.map( specifications, "name" ),    // Pull out the names things could vary by
            "specifications": specifications || []
            }
    },

    /* 
        Specification
        Build specification
    */
    buildSpecification: function ( name, values ) {

        // Force Array
        if( !_.isArray( values ) ) {
            values = [ values ];
        }

        return {
            "name": name,
            "values": values
            }
    }
}