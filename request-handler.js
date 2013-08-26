var url = require('url');

/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var rooms = {};

exports.handleRequest = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);
  var parsedURL = url.parse(request.url).pathname.split("/");
  console.log("Parsed URL: ", parsedURL);

  var statusCode;
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  // handler for message requests
  if (request.method === 'GET') {
    if (parsedURL[1] === 'classes') {
      statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end(rooms[parsedURL[2]]);
    } else {
      // handler for malformed URLs
      statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end("404: didn't find your page breh");
    }
  }

  // handler for submitted messages
  if (request.method === 'POST') {
    if (parsedURL[1] === 'classes') {
      // do something to write the message to the right room
      statusCode = 201;
      response.writeHead(statusCode, headers);
    }
  }
};
