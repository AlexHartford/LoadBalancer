const { spawn } = require('child_process');

var servers = new Map(); // <Port, Capacity>
var waitingServers = new Map(); // <Port, Capacity>

var ports = []; // [Port]
var waitingPorts = []; // [Port]

const MAX_SERVER_CAPACITY = 1000; // maximum data a server can handle

// requests are going to 3000, so the first place we redirect is 3001
var portNum = 3001;

// This code turns console.log into a filewriter
// var fs = require('fs');
// var util = require('util');
// var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
// var log_stdout = process.stdout;

// console.log = function(d) { //
//   log_file.write(util.format(d) + '\n');
//   log_stdout.write(util.format(d) + '\n');
// };

console.log("bridge");

module.exports = {

  getRandomPort() {
    return ports[Math.floor(Math.random() * ports.length)];
  },

  getPorts() {
    return ports;
  },

  // If we have no servers waiting, spawn a new one with a new port and random capacity.
  // Otherwise, grab the server at head of the waiting queue and make it active.
  spawnServer() {
    if (waitingServers.size == 0) {
      servers[portNum] = Math.floor(Math.random() * MAX_SERVER_CAPACITY);
      const node = spawn('node', ['server.js', portNum]);
      console.log("Spawned server on port: " + portNum + " with " + servers[portNum] + " memory.");
      ports.push(portNum++);
    }
    else {
      const port = waitingPorts.shift();
      servers[port] = waitingServers[port];
      waitingServers.delete(port);
      ports.push(port);
    }
  },

  // Take the newest server and put it in the waiting queue.
  killServer(port) {
    ports.splice(ports.indexOf(port), 1);
    
    waitingServers[port] = servers[port];
    waitingPorts.push(port);

    servers.delete(port);
  },

  // Reduces the remaining capacity of a specific port and returns the remaining capacity.
  adjustServerCapacity(port, size) {
    if (servers[port] - size > 0) {
      servers[port] = servers[port] - size;
      console.log('Port: ' + port + ' has ' + servers[port] + ' memory remaining.');
    }
    else {
      servers[port] = Math.floor(Math.random() * MAX_SERVER_CAPACITY);
      console.log('Port: ' + port + ' ran out of memory. Allocated ' + servers[port] + ' memory.');
      this.killServer(port);
      this.spawnServer();
    }
    return servers[port];
  },

  getServerCapacity(port) {
    return servers[port];
  }
};