var express = require("express");
var app = express();

app.get('/', function(req, res) {
    res.send("Hello. I am your favorite server running on " + process.argv[2] + ", handling your request!");
});

app.get('/api/balance', function(req, res) {
    var array = [];

    for(var i = 3001; i <= 3005; i++) {
        if (i == process.argv[2]) array.push(1);
        else array.push(0);
    }

    res.json(array);
});

app.get('/api/test', function(req, res) {
    var array = [];
    for(var i = 0; i < 5; i++)
        array.push(Math.random() * 10);
    res.json(array);
});

app.listen(process.argv[2]);