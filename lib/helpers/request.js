let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:request');
let request = require('request');

function Request( token, staging ) {
        
	let self = this;

	// Stub the headers
    self.headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    // Toggle between production and staging endpoints
    if ( staging ) {
    	self.apiUrl = 'https://api.sandbox.ebay.com';
    	debug("eBay Env: Staging", self.apiUrl)
    } else {
        self.apiUrl = 'https://api.ebay.com';
        debug("eBay Env: Production", self.apiUrl)
    }
}

// Make the request
Request.prototype.makeRequest = function( meth, uri, a_params, a_qsbody, params, callback ) {

	let self = this;

    // Build initial request information
    let reqOpts = {
        uri:    self.apiUrl + uri,
        method: meth,
        headers: self.headers,
        json: true
    };

    // Do some URl love and replace some values
    reqOpts.uri = reqOpts.uri.replace(/{([^{}]+)}/g, function( match, param_key ) {

    	debug("URL Params Replace", match, param_key)

        // Capture provided value
        let val = params[ param_key ];

        // Check provided; delete from query
        if ( _.includes( a_params, param_key ) && val ) {
            // delete params[ param_key ];
            return val;
        }

        // Empty return
        return '';
    });

    // Trim any tailing "/"
    reqOpts.uri = _.trimEnd( reqOpts.uri, "/" );

    // Do we need a QS or BODY?
    let pars = _.pick( params, a_qsbody );
    if( meth == "GET" ) {
    	// Filter Based on allowed Querystring params
    	if ( _.size( pars ) ) reqOpts.qs = pars;
    } else {
    	// POST, PUT, DELETE > Body 
    	if ( _.size( pars ) ) reqOpts.body = pars;
    }

    debug("eBay Request", reqOpts )

    // Make the request
    request( reqOpts, ( err, res, body ) => {
        if ( err ) callback( processError( err ), null );
        else callback( null, body, res.headers );
    });

    function processError( err ) {
    	if ( !err || _.isEmpty( err.errors ) ) return null;
    	return err.errors[0];
    }
}

module.exports = Request;