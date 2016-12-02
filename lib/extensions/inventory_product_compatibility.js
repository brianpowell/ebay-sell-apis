let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:inventory_product_compatibility');
let enums = require('./enums.json');

// Inventory
module.exports = {

	/* 
        Product Compatibilty - MAIN 
        Build the structure for an Product Compatibilty
    */
    buildProductCompatibility: function( sku, compatibleProducts ) {

    	if( !sku  ) {
            debug("Missing Required Param (buildProductCompatibilty)!!!");
            debug(" > sku", sku);
            return false;
        }

        if( !compatibleProducts ) {
        	compatibleProducts = []
        }

    	if( !_.isArray( compatibleProducts ) ) {
    		compatibleProducts = [ compatibleProducts ];
    	}

    	return {
			"compatibleProducts": compatibleProducts,
			"sku": sku
			};
    },

    /* 
        Compatible Product
        Build the structure for a Compatible Product
    */
    buildCompatibleProduct: function ( notes, productFamilyProperties, productIdentifier ) {

    	return { 
			"notes": notes || "",
			"productFamilyProperties": productFamilyProperties || {},
			"productIdentifier": productIdentifier || {}  
			};
    },

    /* 
        Family Properties
        Build the structure for a Family Properties
    */
    buildProductFamilyProperties: function ( engine, make, model, trim, year ) {

    	return { 
		    "engine": 	engine || "",
		    "make": 	make || "",
		    "model": 	model || "",
		    "trim": 	trim || "",
		    "year": 	year || ""
		    };

    },

    buildProductIdentifier: function ( epid, gtin, ktype ) {
    	return { 
		    "epid": 	epid || "",
		    "gtin": 	gtin || "",
		    "ktype": 	ktype || ""
		    };
    }

}