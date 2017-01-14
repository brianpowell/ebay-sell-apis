let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:builder');
let Resource = require('../helpers/resource.js');
let Request = require('../helpers/request.js');

function Builder(){}

Builder.prototype.build = function( node, key, request, enums ) {

	let self = this;

	debug( "Building", key );

	let json = require("../maps/" + key + ".json")

	// This gets it all rolling
	node[key] = {}
	self.buildSections( node[key], json, request );
	if( node.extensions ) {
		node.extensions.extend( node, key, enums );
	}
}

Builder.prototype.buildSections = function( node, parts, request ) {

	let self = this;

	_.each( parts, function( section, api ){

		// only do sections that contain full definitions
		if( !section ) return;

		debug(" > Building Section", api );
		node[api] = self.buildResources( node, api, section, request );
	});
}

// Build out the Resource
Builder.prototype.buildResources = function( node, api, section, request ) {

	let self = this;

	// Pull out the Method Keys
	let methods = _.keys( section.methods );

	// Are we doing all of them?
	if( _.includes( methods, "ALL" ) ) {
		// reconstruct the shorthand to a full set of Restful calls
		section.methods = {
			"GET": 		section.methods["ALL"],
			"POST": 	section.methods["ALL"],
			"PUT": 		section.methods["ALL"],
			"DELETE": 	section.methods["ALL"]
		}
		// Do this again...
		methods = _.keys( section.methods );
	}

	// Bould out the Controllers
	let temp_methods = {}
	_.each( methods, function( method ) {

		// Where to attach to "node[api][key]"
		let key = method.toLowerCase();
		
		// Are we running a fake method
		let act_method = checkFakeMethods( method, section.fakeMethods );
		let uri = section.methods[ method ];

		debug( api, "Attaching", key, uri );

		switch( method ) {
			case "GET":
			case "DELETE":
				// Build request method
				temp_methods[ key ] = new Resource( request, act_method, uri, section.params, section.query );
			break;
			case "POST":
			case "PUT":
				// Do we have method specific body elements?
				let a_body = section.body;
				if( !_.isEmpty( a_body ) && _.isObject( a_body ) && section.body[ method ] ) {
					a_body = section.body[ method ];
				}
				// Build request method
				temp_methods[ key ] = new Resource( request, act_method, uri, section.params, a_body );
			break;
		}
	});

	// Do we need to attach and sub-resources
	if( section.resources ) {
		debug( "  >> ", api, "Attaching Sub resources" );
		self.buildSections( temp_methods, section.resources, request );
	}

	return temp_methods;

	function checkFakeMethods( meth, fakes ) {
		// return default, if no fakes
		if ( !fakes ) return meth;
		// Check for fake or return regular
		return fakes[meth] || meth;
	}
}

module.exports = Builder;
