var express = require("express");
var http = require("http");
var app = express();

app.get('/', function(req, res) {
    res.send("Hello. I am your favorite server running on " + process.argv[2] + ", handling your request!");
});

app.get('/api/balance/:size', function(req, res) {

    console.log('server: ', req.params.size);

    http.get({
        hostname: 'localhost',
        port: 3000,
        path: '/update?port=' + process.argv[2] + '&size=' + req.params.size,
        agent: false
    }, (data) => {
        data.on('data', (myData) => {
            res.json(JSON.parse(myData)); 
            // console.log(JSON.parse(myData)); 
        });
    });
    // res.json('hi');
});

app.listen(process.argv[2]);