
module.exports = function( request, method, uri, allowed_params, allowed_qb ) {

	let self = this;
     	
 	// Refs
 	self.request = request;
	self.method = method;
	self.uri = uri;

	// Alowed Params and Body
	self.allowed_params = allowed_params;
	self.allowed_qb = allowed_qb;

	return function( params, callback ) {
		self.request.makeRequest( self.method, self.uri, self.allowed_params, self.allowed_qb, params, callback )
	}
}
