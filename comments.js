// Create web server
// HTTP module
var http = require('http');
var fs = require('fs');
var path = require('path');
var comments = require('./comments');
var qs = require('querystring');

// Create server
var server = http.createServer(function(req, res) {
  console.log('req.url:', req.url);
  if (req.method === 'POST') {
    // Handle post request
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {
      var comment = qs.parse(body);
      comments.add(comment, function(err) {
        if (err) {
          res.statusCode = 500;
          res.end('Server error');
          return;
        }
        res.end('OK\n');
      });
    });
  } else if (req.method === 'GET') {
    // Handle get request
    if (req.url === '/') {
      fs.readFile(path.join(__dirname, 'index.html'), function(err, data) {
        if (err) {
          res.statusCode = 500;
          res.end('Server error');
          return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      });
    } else if (req.url === '/comments') {
      comments.all(function(err, data) {
        if (err) {
          res.statusCode = 500;
          res.end('Server error');
          return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      });
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

// Listen on port 3000
server.listen(3000);