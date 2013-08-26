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

var headers = defaultCorsHeaders;
headers['Content-Type'] = "text/plain";
var statusCode;

var rooms = {};

exports.handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  var parsedURL = url.parse(request.url).pathname.split("/");
  console.log("Parsed URL: ", parsedURL);

  if (request.method === 'POST') {
    sendMessageHandler(request, response, parsedURL[2]);
  } else if (request.method === 'GET' && parsedURL[1] === 'classes') {
    getMessagesHandler(request, response, parsedURL[2]);
  } else {
    notFoundHandler(request, response);
  }
};

var getMessagesHandler = function(request, response, roomName) {
  statusCode = 200;
  var messages = [];
  var currentMessages = rooms[roomName] || [];
  for (var i = 0; i < currentMessages.length; i++) {
    messages.push(currentMessages[i]);
  }

  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(messages));
};

var sendMessageHandler = function(request, response, roomName) {
  var messageData = '';
  rooms[roomName] = rooms[roomName] || [];
  request.on('data', function(chunk) {
    messageData += chunk;
  });
  request.on('end', function() {
    statusCode = 201;
    var message = {};
    var parsedMessage = JSON.parse(messageData);
    message.username = parsedMessage.username;
    message.message = parsedMessage.message;
    message.createdTime = Date();
    rooms[roomName].push(message);
    response.writeHead(statusCode, headers);
    response.end();
  });
};

var notFoundHandler = function(request, response) {
  statusCode = 404;
  response.writeHead(statusCode, headers);
  response.end("404 not found!");
};
