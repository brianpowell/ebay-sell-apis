let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:inventory');
let enums = require('./enums.json');

// Pull in Sub libs
let item 		= require('./inventory_item.js')
let itemgroup 	= require('./inventory_itemgroup.js')
let location 	= require('./inventory_location.js')
let offer 		= require('./inventory_offer.js')
let comp        = require('./inventory_product_compatibility.js')


// Put all the inventory together
module.exports = _.extend( {}, item, itemgroup, location, offer, comp );