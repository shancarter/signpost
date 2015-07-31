#!/usr/bin/env node

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8888;

var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

var redirects = [
  { shortcut: "shan", url: "http://shancarter.com" }
];
var redirectsByShortcut = {};

html += "<ul>";
redirects.forEach(function(redirect) {
  html += "<li><a href='" + redirect.url + "'>" + redirect.shortcut + "</a></li>";
  redirectsByShortcut[redirect.shortcut] = redirect;
});
html += "</ul>";

http.createServer(function(request, response) {
  var shortcut = url.parse(request.url).pathname.slice(1);

  if (redirectsByShortcut[shortcut]) {
    response.writeHead(302, { "Location": redirectsByShortcut[shortcut].url });
  } else {
    response.writeHead(200);
    response.write(html, "utf8");
  }
  response.end();
}).listen(parseInt(port, 10));

console.log("File server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
