let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:inventory_location');
let enums = require('./enums.json');

// Inventory
module.exports = {

	/* 
        Location - MAIN 
        Build the structure for an inventory location
        Defaults:
        	location.merchantLocationStatus = "ENABLED"
    */
    buildLocation: function( location, address, locationType, operatingHours, specialHours ) {

        if( !location.name ) {
            debug("Missing Required Param (buildLocation)!!!");
            debug(" > name", location.name);
            return false;
        }

        if( _.isEmpty( address ) && _.isEmpty( location.location.address ) ) {
            debug("Missing Required Param (buildLocation)!!!");
            debug(" > address", address);
            debug(" > location.address", location.location.address);
            return false;
        }

        // locationType is technically optional, but need to be an array
        if( locationType && !_.includes( enums.store_types, String( locationType ).toUpperCase() ) ) {
            debug("Unsupported locationType", locationType)
            return false;
    	} else if( !_.isArray( locationType ) ) {
            locationType = [ locationType ];
        }

        // Handoffs for extending
        if ( !location.operatingHours && operatingHours ) {
            location.operatingHours = operatingHours;
        }
        if ( !location.operatingHours && operatingHours ) {
            location.operatingHours = operatingHours;
        }
        if ( !location.specialHours && specialHours ) {
            location.specialHours = specialHours;
        }

        return _.extend( {
            "location": {},
		    "locationInstructions": "",
            "locationAdditionalInformation": "",
            "locationWebUrl": "",
            "name": "",
            "phone": "",
            "merchantLocationStatus": "ENABLED",
		    "locationTypes": locationType,
		    "operatingHours": 	[],
		    "specialHours": 	[]
			}, location );
    },

    /* 
        Address
        Build structure of a Location Address
        Country defaults to US
        address: "addressLine1"
	             "addressLine2"
	             "city"
	             "stateOrProvince"
	             "postalCode"
	             "country"
	    geoCoordinates: "latitude" "longitude"
    */
    buildAddress: function ( address, geoLoc ) {

    	if( address.country && !_.includes( enums.countries, String( address.country ).toUpperCase() ) ) {
            debug("Unsupported address.country", address.country)
            return false;
    	}

    	let out = {
        	address: _.extend( {
	            "addressLine1": "",
	            "addressLine2": "",
	            "city": "",
	            "stateOrProvince": "",
	            "postalCode": "",
	            "country": "US"
	        	}, address )
        	}

        // Do we need to attach any geolocation information?
        let geo = {};
        if( !_.isEmpty( geoLoc ) ) {
        	geo = {
	        	geoCoordinates: _.extend({
			        "latitude": 0.0,
			        "longitude": 0.0
			        }, geoLoc)
			    };
        }

        return _.extend( out, geo );
    },

    /* 
        Hour
        Build Hour for use in location operating/special hours

        type = "operating" or "special"
        val = either DAY ENUM or date
        intervals: [ { "open": "09:00:00", "close": "11:00:00" }, ... ]
    */
    buildHour: function _buildHour( type, day_val, intervals ) {

    	if( !type || !day_val || _.isEmpty( intervals ) ) {
            debug("Missing Required Param (buildHour)!!!");
            debug(" > type", type);
            debug(" > day_val", day_val);
            debug(" > intervals", intervals);
            return false;
        }

        // Force Array
        if( !_.isArray( intervals ) ) {
            intervals = [ intervals ];
        }

        let hours_day = {
        	"intervals": intervals
        }

        if ( type == "operating" ) {

        	// Check Day enum
        	if( !_.includes( enums.days, String( day_val ).toUpperCase() ) ) {
	            debug("Unsupported day_val", day_val)
	            return false;
	        }
	        hours_day["dayOfWeek"] = day_val;

        } else if ( type == "special" ) {
        	hours_day["date"] = day_val
        }

        return hours_day
		    
    },

    /* 
        Interval
        Build Interval for location Hours
        { "open": "09:00:00", "close": "11:00:00" }
    */
    buildInterval: function ( open, close ) {

        return {
            "open":     open || "",
            "close":    close || ""
        };

    }
}