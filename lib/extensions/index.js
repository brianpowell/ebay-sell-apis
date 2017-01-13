let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:helpers');

function Extensions(){}

Extensions.prototype.extend = function( ebay, name, enums ) {

    // Load in extensions
    let _extensions = require('./' + name + '.js')( enums );

    debug("Extending", name)

	_.assign( ebay[name], _extensions );

}

module.exports = Extensions;
