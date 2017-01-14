let _ = require('lodash');
let qs = require('qs');
let debug = require('debug')('ebay-sell-apis:request');
let request = require('request');

// Ebay Endpoints
let staging = {
    auth:       "https://signin.sandbox.ebay.com/authorize",
    authtoken:  "https://api.sandbox.ebay.com/identity/v1/oauth2/token",
    api:        "https://api.sandbox.ebay.com"
}
let production = {
    auth:       "https://signin.ebay.com/authorize",
    authtoken:  "https://api.ebay.com/identity/v1/oauth2/token",
    api:        "https://api.ebay.com"
}

let scopes = {
    "api_scope":                    "https://api.ebay.com/oauth/api_scope",
    "sell-account-readonly":        "https://api.ebay.com/oauth/api_scope/sell.account.readonly",
    "sell-account":                 "https://api.ebay.com/oauth/api_scope/sell.account",
    "sell-marketing-readonly":      "https://api.ebay.com/oauth/api_scope/sell.marketing.readonly",
    "sell-marketing":               "https://api.ebay.com/oauth/api_scope/sell.marketing",
    "sell-inventory-readonly":      "https://api.ebay.com/oauth/api_scope/sell.inventory.readonly",
    "sell-inventory":               "https://api.ebay.com/oauth/api_scope/sell.inventory",
    "sell-fulfillment-readonly":    "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
    "sell-fulfillment":             "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
    "sell-analytics-readonly":      "https://api.ebay.com/oauth/api_scope/sell.analytics.readonly"
}

let string_scopes = {
    read: [ "api_scope", "sell-account-readonly", "sell-marketing-readonly", "sell-inventory-readonly", "sell-fulfillment-readonly", "sell-analytics-readonly" ],
    readwrite: [ "api_scope" ,"sell-account", "sell-marketing", "sell-inventory", "sell-fulfillment", "sell-analytics-readonly" ]
}

// Add in the a lodash method for scrubbing Empty objects that are nested
var scrubEmpty = function ( obj ) {
    return _.transform( obj, function ( o, v, k ) {
        if ( v && typeof v === "object" ) {
            if( _.isEmpty( v ) ) return; // ignore empty objects
            o[ k ] = _.scrubEmpty( v );
        } else if (v) {
            o[ k ] = v;
        }
    });
};

_.mixin({ 'scrubEmpty': scrubEmpty });

function Request( access_token, staging_flag ) {
        
	let req = this;

    // Set Auth Token
    req.access_token = access_token;

    // Toggle between production and staging endpoints
    if ( staging_flag ) {
        req.authUrl     = staging.auth;
        req.tokenUrl    = staging.authtoken;
    	req.apiUrl      = staging.api;
    	debug("eBay Env: Staging", req.apiUrl );
    } else {
        req.authUrl     = production.auth;
        req.tokenUrl    = production.authtoken;
        req.apiUrl      = production.api;
        debug("eBay Env: Production", req.apiUrl );
    }
}

// Set/Update the Auth Token
Request.prototype.getAuthUrl = function( state, in_scopes, config ) {
    
    let req = this;

    if( !in_scopes || ( _.isArray( in_scopes ) && _.isEmpty( in_scopes ) ) ) {
         debug("getAuthUrl > missing requires inputs, scopes" );
        return false;
    }

    // Use all Scopes
    let req_scopes = [];
    // Imply full
    if ( _.isString( in_scopes ) ) {
        // Pick out the Scopes we need to use
        req_scopes = _.values( _.pick( scopes, string_scopes[ in_scopes ] ) );
    } else if ( _.isArray( in_scopes ) ) {
        // Pick out specific scopes for by the User
        req_scopes = _.values( _.pick( scopes, in_scopes ) );
    }

    // Check if we actually have some scopes
    if( _.isEmpty( req_scopes ) ) {
        debug("getAuthUrl error > missing scopes", in_scopes );
        return false;
    }

    debug("Requested Scopes", req_scopes)

    let query = {
        client_id:      config.client_id,
        response_type:  "code",
        redirect_uri:   config.runame,
        scope:          req_scopes.join(" "),
        state:          state || ""
    }

    return req.authUrl + "?" + qs.stringify( query );
}

// Set/Update the Auth Token
Request.prototype.setToken = function( access_token ) {
    let req = this;
    req.access_token = access_token;
}

// exchangeToken
Request.prototype.exchangeCode = function( code, config, callback ) {

    let req = this;

    let token = config.client_id + ":" + config.secret;

    // Stub the headers
    let headers = {
        'Authorization': 'Basic ' + new Buffer( token ).toString('base64'),
        'Content-Language': 'en-US',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    };

    // Build initial request information
    let reqOpts = {
        uri:        req.tokenUrl,
        method:     "POST",
        headers:    headers,
        data: qs.stringify({
            grant_type:     "",
            code:           code,
            redirect_uri:   config.runame
        })
    };

    // Send the request
    request( reqOpts, ( err, res, body ) => {
        if ( err || ( body && body.errors ) ) {
            // debug("Request Error", body.errors)
            callback( processError( body ), null );
        } else {
            callback( null, body, res.headers );
        }
    });

}

// Make the request
Request.prototype.makeRequest = function( meth, uri, a_params, a_qsbody, params, callback ) {

	let req = this;

    if( !req.access_token ) {
        debug("ERROR: Do not have a valid access_token");
        callback("Missing Access Token", null);
        return
    }

    // Stub the headers
    let headers = {
        'Authorization': 'Bearer ' + req.access_token,
        'Content-Language': 'en-US',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    // Build initial request information
    let reqOpts = {
        uri:        req.apiUrl + uri,
        method:     meth,
        headers:    headers,
        json:       true
    };

    // Do some URl love and replace some values
    reqOpts.uri = reqOpts.uri.replace(/{([^{}]+)}/g, function( match, param_key ) {

    	debug("URL Params Replace", match, param_key)

        // Capture provided value
        let val = params[ param_key ];

        // Check provided; delete from query
        if ( _.includes( a_params, param_key ) && val ) {
            delete params[ param_key ];
            return val;
        }

        // Empty return
        return '';
    });

    // Trim any tailing "/"
    reqOpts.uri = _.trimEnd( reqOpts.uri, "/" );

    // What values are we allowing?
    let pars = _.pick( params, a_qsbody );

    // Attach it to the right part of the request and scrub any empty values.
    if( meth == "GET" || meth == "DELETE" ) {
    	// Filter Based on allowed Querystring params
    	if ( _.size( pars ) ) reqOpts.qs = _.scrubEmpty( pars );
    } else {
    	// POST, PUT, DELETE > Body 
    	if ( _.size( pars ) ) reqOpts.body = _.scrubEmpty( pars );
    }

    debug("eBay Request", reqOpts )

    // Make the request
    request( reqOpts, ( err, res, body ) => {
        if ( err || ( body && body.errors ) ) {
            // debug("Request Error", body.errors)
            callback( processError( body ), null );
        } else {
            callback( null, body, res.headers );
        }
    });

}

function processError( err ) {
    if ( !err || _.isEmpty( err.errors ) ) return null;
    return err.errors[0];
}

module.exports = Request;