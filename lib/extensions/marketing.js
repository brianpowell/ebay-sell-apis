let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:marketing');

module.exports = function( enums ) {
	// Pull in Sub libs
	let ad 			= require('./marketing_ad.js')( enums );
	let promotion 	= require('./marketing_promotion.js')( enums );

	// Put all the marketing together
	return _.extend( {}, ad, promotion );
}