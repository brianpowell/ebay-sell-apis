let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:inventory_product_compatibility');

// Inventory
module.exports = function( enums ) {

	/* 
        Product Compatibilty - MAIN 
        Build the structure for an Product Compatibilty
    */
    function _buildProductCompatibility ( sku, compatibleProducts ) {

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
    }

    /* 
        Compatible Product
        Build the structure for a Compatible Product
    */
    function _buildCompatibleProduct ( notes, productFamilyProperties, productIdentifier ) {

    	return { 
			"notes": notes || "",
			"productFamilyProperties": productFamilyProperties || {},
			"productIdentifier": productIdentifier || {}  
			};
    }

    /* 
        Family Properties
        Build the structure for a Family Properties
    */
    function _buildProductFamilyProperties ( engine, make, model, trim, year ) {

    	return { 
		    "engine": 	engine || "",
		    "make": 	make || "",
		    "model": 	model || "",
		    "trim": 	trim || "",
		    "year": 	year || ""
		    };

    }

    function _buildProductIdentifier ( epid, gtin, ktype ) {
    	return { 
		    "epid": 	epid || "",
		    "gtin": 	gtin || "",
		    "ktype": 	ktype || ""
		    };
    }

    // return methods
    return {
        buildProductCompatibility:      _buildProductCompatibility,
        buildCompatibleProduct:         _buildCompatibleProduct,
        buildProductFamilyProperties:   _buildProductFamilyProperties,
        buildProductIdentifier:         _buildProductIdentifier
    }

}