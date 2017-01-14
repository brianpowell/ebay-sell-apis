let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:common');

// Common
module.exports = function( enums ) {

        /* 
        Amount
        Simple pairs for amount cost values
        Detauls:
            currency = "USD"
    */
    function _buildAmount( value, currency ) {

        if( currency && !_.includes( enums.currencies, String( currency ).toUpperCase() ) ) {
            debug("Unsupported currency", currency)
            return false;
        }

        return { 
            "value": String( value ),
            "currency": currency || "USD"
            };
    }

    /* 
        Category Type
        Simple pairs for amount cost values
        Defaults:
            name = "ALL_EXCLUDING_MOTORS_VEHICLES"
    */
    function _buildCategoryType( name, def ) {

        if( name && !_.includes( enums.category_names, String( name ).toUpperCase() ) ) {
            debug("Unsupported categoryType.name", name)
            return false;
        }

        return { 
            "name": name || "ALL_EXCLUDING_MOTORS_VEHICLES",
            "default": ( def != undefined ) ? def : true
            };
    }

    /* 
        Build Region
        Simple pairs for Build Regions
     */
    function _buildRegion( name, type ){

        if( !_.includes( enums.region_type, String( type ).toUpperCase() ) ) {
            debug("Unsupported region.type", type)
            return false;
        }

        return { 
            "regionName": name,
            "regionType": type
            }
    }

    /* 
        Time Duration
        Simple pairs for Time Durations
        Defaults:
            value: 1
            unit: "DAY"
     */
    function _buildTimeDuration( value, unit ){

        if( !_.includes( enums.duration, String( unit ).toUpperCase() ) ) {
            debug("Unsupported timeDuration.unit", unit)
            return false;
        }

        return {
            "unit": unit || "DAY",
            "value": value || 1
            }
    }

    return {
        buildAmount:        _buildAmount,
        buildCategoryType:  _buildCategoryType,
        buildRegion:        _buildRegion,
        buildTimeDuration:  _buildTimeDuration
    }
}