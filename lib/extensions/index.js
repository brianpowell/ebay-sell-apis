let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:helpers');
let enums = require('./enums.json');

function Extensions(){}

Extensions.prototype.extend = function( ebay, name ) {

    // Load in extensions
    let _extensions = require('./' + name + '.js');

    debug("Extending", name)

	_.assign(ebay[name], _extensions );

}

module.exports = Extensions;
