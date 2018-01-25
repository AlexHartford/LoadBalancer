var express = require("express");
var app = express();

app.get('/', function(req, res) {
    res.send("Hello. I am your favorite server running on " + process.argv[2] + ", handling your request!");
});

app.post('/post', function(req, res) {
    res.send();
});

app.listen(process.argv[2]);