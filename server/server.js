var express = require("express");
var http = require("http");
var app = express();

const bridge = require("./bridge");

app.get('/', function(req, res) {
    res.send("Hello. I am your favorite server running on " + process.argv[2] + ", handling your request!");
});

app.get('/api/balance/:size', function(req, res) {

    http.get({
        hostname: 'localhost',
        port: 3000,
        path: '/update?port=' + process.argv[2] + '&size=' + req.params.size,
        agent: false
    }, (res) => {
    // Do stuff with response.. NAH
    });

    console.log(process.argv[2] + ": " + bridge.adjustServerCapacity(process.argv[2], req.params.size));
    res.json(process.argv[2]);
});

app.listen(process.argv[2]);