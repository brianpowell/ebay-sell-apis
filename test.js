let eBay = require('./index.js')
let debug = require('debug')('ebay-sell-apis:test');

let ebay = new eBay("sdfasdfad", true);

debug("ebay", ebay)

// Test Offer
let params = {
	offer_id: "dfasdfa"
}

ebay.inventory.offer.post( params, function(err, offer, headers) {
	debug("TEst", err, offer, headers)
})
