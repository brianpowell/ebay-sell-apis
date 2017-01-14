let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:account');

module.exports = function( enums ) {
	// Pull in Sub libs
	let fulfillment = require('./account_fulfillment.js')( enums );
	let payment 	= require('./account_payment.js')( enums );
	let returns     = require('./account_return.js')( enums );
	let sales_tax   = require('./account_sales_tax.js')( enums );

	// Put all the account together
	return _.extend( {}, fulfillment, payment, returns, sales_tax );
}