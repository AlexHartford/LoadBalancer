var express  = require('express');
const { spawn } = require('child_process');
var httpProxy = require('http-proxy');
var app      = express();
var apiProxy = httpProxy.createProxyServer();

var ports = [3001, 3002, 3003, 3004, 3005];

for (var port of ports) {
    const node = spawn('node', ['server.js', port]);
}
 
app.all("/*", function(req, res) {
    var randomPort = ports[Math.floor(Math.random() * ports.length)];
    console.log('Redirecting request to server running on port ' + randomPort);
    apiProxy.web(req, res, {target: 'http://localhost:' + randomPort});
});

app.listen(3000);