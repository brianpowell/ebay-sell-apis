let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:fulfillment');
let enums = require('./enums.json');

// Pull in Sub libs
let shipping 	= require('./fulfillment_shipping.js')

// Put all the fulfillment together
module.exports = _.extend( {}, shipping );