var express  = require('express');
const { spawn } = require('child_process');
var httpProxy = require('http-proxy');
var app      = express();
var apiProxy = httpProxy.createProxyServer();

var bridge = require("./bridge");

bridge.spawnServer(); // we need at least one server to run on after all!

app.all("/*", function(req, res) {

    var ports = bridge.getPorts();
    console.log(ports);

    for (var port of ports) {
        const node = spawn('node', ['server.js', port]);
    }

    console.log("Balancer: " + bridge.getServerCapacity(3001));

    const randomPort = bridge.getRandomPort();

    console.log('Redirecting request to server running on port ' + randomPort);
    apiProxy.web(req, res, {target: 'http://localhost:' + randomPort});
});

app.listen(3000);