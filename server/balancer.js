var express  = require('express');
var httpProxy = require('http-proxy');
var app      = express();
var apiProxy = httpProxy.createProxyServer();

bridge = require("./bridge");

bridge.spawnServer(); // we need at least one server to run on after all!

app.all("/api/*", function(req, res) {

    var ports = Object.keys(bridge.getServers());
    console.log("current ports: ", ports);

    for (var port of ports) {
        console.log("Port " + port + " has " + bridge.getServerCapacity(port) + " memory remaining.");
    }

    console.log("waiting ports: ", bridge.getWaitingPorts());
    console.log("current servers: ", bridge.getServers());
    const randomPort = bridge.getRandomPort();

    console.log('Redirecting request to server running on port ' + randomPort);
    apiProxy.web(req, res, {target: 'http://localhost:' + randomPort});
    // ports.splice(ports.indexOf(3001), 1);
});

app.get("/update", function(req, res) {
    console.log('update: ', req.query.size);
    console.log('updating ', req.query.port + ": " + bridge.adjustServerCapacity(req.query.port, req.query.size));
    // console.log('update servers: ', bridge.getServers());
    res.status(200).json([bridge.getServers(), bridge.getWaitingServers()]);
});

app.get("/size/:port", function(req, res) {
    res.json(bridge.getServerCapacity(req.params.port));
});

app.listen(3000);