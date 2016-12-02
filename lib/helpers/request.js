let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:request');
let request = require('request');

function Request( access_token, staging ) {
        
	let req = this;

    // Set Auth Token
    req.access_token = access_token;

    // Toggle between production and staging endpoints
    if ( staging ) {
    	req.apiUrl = 'https://api.sandbox.ebay.com';
    	debug("eBay Env: Staging", req.apiUrl );
    } else {
        req.apiUrl = 'https://api.ebay.com';
        debug("eBay Env: Production", req.apiUrl );
    }
}

// Set/Update the Auth Token
Request.prototype.setToken = function( access_token ) {
    let req = this;
    req.access_token = access_token;
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

    // Do we need a QS or BODY?
    let pars = _.pick( params, a_qsbody );
    if( meth == "GET" || meth == "DELETE" ) {
    	// Filter Based on allowed Querystring params
    	if ( _.size( pars ) ) reqOpts.qs = pars;
    } else {
    	// POST, PUT, DELETE > Body 
    	if ( _.size( pars ) ) reqOpts.body = pars;
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

    function processError( err ) {
    	if ( !err || _.isEmpty( err.errors ) ) return null;
    	return err.errors[0];
    }
}

module.exports = Request;