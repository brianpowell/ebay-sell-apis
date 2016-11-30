let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:marketing');
let enums = require('./enums.json');

// Pull in Sub libs
let ad 			= require('./marketing_ad.js')
let promotion 	= require('./marketing_promotion.js')

// Put all the marketing together
module.exports = _.extend( {}, ad, promotion );