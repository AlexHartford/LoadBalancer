var express  = require('express');
var httpProxy = require('http-proxy');
var app      = express();
var apiProxy = httpProxy.createProxyServer();

bridge = require("./bridge");

bridge.spawnServer(); // we need at least one server to run on after all!

app.all("/api/*", function(req, res) {

    var ports = bridge.getPorts();
    console.log(ports);

    for (var port of ports) {
        console.log("Port " + port + " has " + bridge.getServerCapacity(port) + " memory remaining.");
    }

    const randomPort = bridge.getRandomPort();

    console.log('Redirecting request to server running on port ' + randomPort);
    apiProxy.web(req, res, {target: 'http://localhost:' + randomPort});
});

app.get("/update", function(req, res) {
    console.log(req.query.port + ": " + bridge.adjustServerCapacity(req.query.port, req.query.size));
    res.send("Update");
});

app.listen(3000);