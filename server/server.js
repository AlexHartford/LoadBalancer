var express = require("express");
var app = express();

const bridge = require("./bridge");

app.get('/', function(req, res) {
    res.send("Hello. I am your favorite server running on " + process.argv[2] + ", handling your request!");
});

app.get('/api/balance/:size', function(req, res) {
    console.log(process.argv[2] + ": " + bridge.adjustServerCapacity(process.argv[2], req.params.size));
    res.json(process.argv[2]);
});

app.get('/api/server/:port', function(req, res) {
    res.json(bridge.getServerCapacity(req.params.port));
});

app.listen(process.argv[2]);