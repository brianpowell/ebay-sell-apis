let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:inventory_itemgroup');

// Inventory
module.exports = function( enums ){

	/* 
        ItemGroup - MAIN 
        Build structure of an Item
        You can pass in the "imageUrls", "packageWeightAndSize", and "product" as either separate params or within the main "item" param
    */
    function _buildItemGroup ( itemGroup, variantSKUs, variesBy ) {

        if( !itemGroup.title || !itemGroup.description ) {
            debug("Missing Required Param (buildItemGroup)!!!");
            debug(" > title", itemGroup.title);
            debug(" > description", itemGroup.description);
            return false;
        }

        // Handoffs for extending
        if ( !itemGroup.variantSKUs && variantSKUs ) {
            itemGroup.variantSKUs = variantSKUs;
        }
        if ( !itemGroup.variesBy && variesBy ) {
            itemGroup.variesBy = variesBy;
        }

        let out = {
            "aspects":                  {},
            "description":              "",
            "imageUrls":                [],
            "subtitle":                 "",
            "title":                    "",
            "variantSKUs":              [],
            "variesBy":                 []
            }

        _.extend( out, itemGroup );

        return out;
    }

    /* 
        VariesBy
        Build structure of an Item
        You can pass in the "availability", "packageWeightAndSize", and "product" as either separate params or within the main "item" param
    */
    function _buildVariesBy ( specifications ) {

        return {
            "aspectsImageVariesBy": _.map( specifications, "name" ),    // Pull out the names things could vary by
            "specifications": specifications || []
            }
    }

    /* 
        Specification
        Build specification
    */
    function _buildSpecification ( name, values, order ) {

        // Force Array
        if( !_.isArray( values ) ) {
            values = [ values ];
        }

        return {
            "name": name,
            "values": values,
            "order": order || 1
            }
    }

    // return methods 
    return {
        buildItemGroup:     _buildItemGroup,
        buildVariesBy:      _buildVariesBy,
        buildSpecification: _buildSpecification
    }
}