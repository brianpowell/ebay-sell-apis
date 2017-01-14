let _ = require('lodash');
let async = require('async');
let debug = require('debug')('tests:auth');

// Pull in Main Lib
let eBay = require('../index.js')

// eBay Config
let ebay_config = {
	client_id: process.env.EBAY_CLIENT_ID,
	runame: process.env.EBAY_RUNAME,
	staging: true
}
// Let's Roll!
let ebay = new eBay( ebay_config );

let enums = ebay.getENUMS();
// debug("Enums", enums );

let enums_mk = ebay.getENUMS("marketplace_ids");
// debug("Enums 'marketplace_ids'", enums_mk );

let authURL = ebay.getAuthUrl();
debug("Auth URL", authURL );