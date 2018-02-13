const { spawn } = require('child_process');

console.log("Bridge Initialized!");

const bridge = {

  initialized: false,

  servers: { }, // <Port, Capacity>
  waitingServers: { }, // <Port, Capacity>

  waitingPorts: [], // [Port]

  MAX_SERVER_CAPACITY: 1000, // maximum data a server can handle
  MAX_PROCESS_TIME: 15000, // Can take up to a minute for a server to recover

  // requests are going to 3000, so the first place we redirect is 3001
  portNum: 3001,

  init() {
    this.initialized = true;
    setInterval(() => {
      for (let server in this.servers) {
        if (this.servers[server] <= 500) this.servers[server] += 25;
        if (this.servers[server] > 500) this.servers[server] = 500;
      }

      for (let server in this.waitingServers) {
        if (this.waitingServers[server] <= 500) this.waitingServers[server] += 25;
        if (this.waitingServers[server] > 500) this.servers[server] = 500;
      }
    }, 1000);
  },

  getRandomPort() {
    if (Object.keys(this.waitingServers).length != 0 || this.waitingPorts.length != 0) {
      if (Math.floor(Math.random() * 15) == 1) {
        this.spawnServer();
      }
    }
    return Object.keys(this.servers)[Math.floor(Math.random() * Object.keys(this.servers).length)];
  },

  getWaitingPorts() {
    return this.waitingPorts;
  },

  getServers() {
    return this.servers;
  },

  getWaitingServers() {
    return this.waitingServers;
  },

  // If we have no servers waiting, spawn a new one with a new port and random capacity.
  // Otherwise, grab the server at head of the waiting queue and make it active.
  spawnServer() {
    if (Object.keys(this.waitingServers).length == 0 || this.waitingPorts.length == 0) {
      // this.servers[this.portNum] = Math.floor(Math.random() * this.MAX_SERVER_CAPACITY);
      this.servers[this.portNum] = 500;
      const node = spawn('node', ['server.js', this.portNum]);
      console.log("Spawned server on port " + this.portNum + " with " + this.servers[this.portNum.toString()] + " memory.");
      this.portNum++;
      return this.portNum - 1;
    }
    else {
      const port = this.waitingPorts.shift();
      console.log("Pulled server from waiting queue on port " + port);
      this.servers[port] = this.waitingServers[port];
      delete this.waitingServers[port];
      return port;
    }
  },

  // Take the newest server and put it in the waiting queue.
  killServer(port) {
    port = port.toString();

    let temp = this.servers[port];

    setTimeout(() => {
      this.waitingServers[port] = temp;
      this.waitingPorts.push(port);
    }, Math.floor(Math.random() * this.MAX_PROCESS_TIME));
    delete this.servers[port];
  },

  // Reduces the remaining capacity of a specific port and returns the remaining capacity.
  adjustServerCapacity(port, size) {
    port = port.toString();

    if (this.servers[port] - size > 0) {
      this.servers[port] = this.servers[port] - size;
      // console.log('Port: ' + port + ' has ' + this.servers[port] + ' memory remaining.');
      return this.servers[port];
    }
    else {
      if (!this.initialized) this.servers[port] = 500;
      console.log('Port: ' + port + ' ran out of memory. Allocated ' + this.servers[port] + ' memory.');
      this.killServer(port);
      if (Object.keys(this.servers).length == 0)
        return this.servers[this.spawnServer()];
    }
    return this.servers[port];
  },

  getServerCapacity(port) {
    port = port.toString();
    return this.servers[port];
  }
};

module.exports = bridge;