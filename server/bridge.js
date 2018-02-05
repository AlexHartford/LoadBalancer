const { spawn } = require('child_process');

// var servers = new Map(); // <Port, Capacity>
// var waitingServers = new Map(); // <Port, Capacity>

// var ports = []; // [Port]
// var waitingPorts = []; // [Port]

// const MAX_SERVER_CAPACITY = 1000; // maximum data a server can handle

// // requests are going to 3000, so the first place we redirect is 3001
// var portNum = 3001;

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

const bridge = {

  servers: new Map(), // <Port, Capacity>
  waitingServers: new Map(), // <Port, Capacity>

  ports: [], // [Port]
  waitingPorts: [], // [Port]

  MAX_SERVER_CAPACITY: 1000, // maximum data a server can handle

  // requests are going to 3000, so the first place we redirect is 3001
  portNum: 3001,

  getRandomPort() {
    return this.ports[Math.floor(Math.random() * this.ports.length)];
  },

  getPorts() {
    return this.ports;
  },

  // If we have no servers waiting, spawn a new one with a new port and random capacity.
  // Otherwise, grab the server at head of the waiting queue and make it active.
  spawnServer() {
    if (this.waitingServers.size == 0) {
      this.servers[this.portNum] = Math.floor(Math.random() * this.MAX_SERVER_CAPACITY);
      const node = spawn('node', ['server.js', this.portNum]);
      console.log("Spawned server on port: " + this.portNum + " with " + this.servers[this.portNum] + " memory.");
      this.ports.push(this.portNum++);
    }
    else {
      const port = this.waitingPorts.shift();
      this.servers[port] = this.waitingServers[port];
      this.waitingServers.delete(port);
      this.ports.push(port);
    }
  },

  // Take the newest server and put it in the waiting queue.
  killServer(port) {
    this.ports.splice(this.ports.indexOf(port), 1);
    
    this.waitingServers[port] = this.servers[port];
    this.waitingPorts.push(port);

    this.servers.delete(port);
  },

  // Reduces the remaining capacity of a specific port and returns the remaining capacity.
  adjustServerCapacity(port, size) {
    if (this.servers[port] - size > 0) {
      this.servers[port] = this.servers[port] - size;
      console.log('Port: ' + port + ' has ' + this.servers[port] + ' memory remaining.');
    }
    else {
      this.servers[port] = Math.floor(Math.random() * this.MAX_SERVER_CAPACITY);
      console.log('Port: ' + port + ' ran out of memory. Allocated ' + this.servers[port] + ' memory.');
      this.killServer(port);
      this.spawnServer();
    }
    return this.servers[port];
  },

  getServerCapacity(port) {
    return this.servers[port];
  }
};

module.exports = bridge;