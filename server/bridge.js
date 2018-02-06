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
  MAX_PROCESS_TIME: 60000, // Can take up to a minute for a server to recover

  // requests are going to 3000, so the first place we redirect is 3001
  portNum: 3001,

  getRandomPort() {
    return this.ports[Math.floor(Math.random() * this.ports.length)];
  },

  getPorts() {
    return this.ports;
  },

  getWaitingPorts() {
    return this.waitingPorts;
  },

  getServers() {
    console.log('getServers: ', this.servers);
    return this.servers;
  },

  getWaitingServers() {
    return this.waitingServers;
  },

  // If we have no servers waiting, spawn a new one with a new port and random capacity.
  // Otherwise, grab the server at head of the waiting queue and make it active.
  spawnServer() {
    console.log("SpawnServer: ", this.waitingServers, ", size = ", this.waitingServers.size);
    if (this.waitingServers.size == 0 || this.waitingPorts.length == 0) {
      console.log("Spawning new server");
      // this.servers[this.portNum] = Math.floor(Math.random() * this.MAX_SERVER_CAPACITY);
      // this.servers[this.portNum] = 500;
      console.log('spawnserver: ', this.servers.set(this.portNum.toString(), 500));
      const node = spawn('node', ['server.js', this.portNum]);
      console.log("Spawned server on port: " + this.portNum + " with " + this.servers.get(this.portNum.toString()) + " memory.");
      this.ports.push(this.portNum++);
    }
    else {
      console.log("Using pre-existing server");
      const port = this.waitingPorts.shift();
      // this.servers[port] = this.waitingServers[port];
      this.servers.set(port, this.waitingServers.get(port));
      this.waitingServers.delete(port);
      this.ports.push(port);
    }
  },

  // Take the newest server and put it in the waiting queue.
  killServer(port) {
    port = port.toString();
    this.ports.splice(this.ports.indexOf(port), 1);
    
    setTimeout(() => {
      // this.waitingServers[port] = this.servers[port];
      this.waitingServers.set(port, this.servers.get(port));
      this.waitingPorts.push(port);
    }, Math.floor(Math.random() * this.MAX_PROCESS_TIME));
    // console.log(this.servers);
    console.log(this.servers.delete(port));
    // console.log(this.servers);
  },

  // Reduces the remaining capacity of a specific port and returns the remaining capacity.
  adjustServerCapacity(port, size) {
    port = port.toString();
    console.log('size: ', size);

    console.log("SERVERS SIZE: " + this.servers.size);
    console.log("SERVERS: ", this.servers);
    if (this.servers.get(port) - size > 0) {
      // this.servers[port] = this.servers[port] - size;
      this.servers.set(port, this.servers.get(port) - size);
      console.log('Port: ' + port + ' has ' + this.servers.get(port) + ' memory remaining.');
    }
    else {
      // this.servers[port] = Math.floor(Math.random() * this.MAX_SERVER_CAPACITY);
      this.servers.set(port, 500);
      console.log('Port: ' + port + ' ran out of memory. Allocated ' + this.servers.get(port) + ' memory.');
      this.killServer(port);
      this.spawnServer();
    }
    // return this.servers[port];
    return this.servers.get(port);
  },

  getServerCapacity(port) {
    port = port.toString();
    // return this.servers[port];
    return this.servers.get(port);
  }
};

module.exports = bridge;