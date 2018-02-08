import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClient } from '@angular/common/http';

import { Server } from './server';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private servers: Server[] = [];
  private waitingServers: Server[] = [];
  private portNumber: number = 3001;
  private currentIntervalId;
  private MAX_REQUEST_SIZE: number = 100; // max size a request can request

  // plot options
  title = 'AR Social Media Load Balancer';
  view: any[] = [700, 400];
  showXAxis = true;
  showYAxis = true;     
  gradient = false;     
  showLegend = true;       
  showXAxisLabel = false;        
  xAxisLabel = 'Server';        
  showYAxisLabel = true;        
  yAxisLabel = 'Workload';
  yAxisLabel2 = 'Capacity';
  yScaleMax = 500;
  colorScheme = {
    domain: ['#0C0032', '#190061', '#240090', '#3500D3', '#282828']
  };

  constructor(private http: HttpClient) {
    // for (let i = 0; i < 5; i++) this.spawnServer('Server ' + i, i, 1, 25);
    // this.spawnServer(this.portNumber++);
    // this.servers.push(new Server(3001, 500));
    let yolo = this.servers;  // because apparently it's illegal to put { this.servers }
    Object.assign(this, { yolo });
    this.setInterval(400);
  }
  
  // Spawns a server if there are no extra servers waiting.  Otherwise grab a server off the waiting queue.
  // spawnServer(port: number) {
  //   if (this.waitingServers.length == 0) {
  //     console.log("ASDFASDFASDFASDFASDFASDFASDFASDFASDFASDFASDFASDFASDFASDF");
  //     // this.http.get<number>('/size/' + port).subscribe(capacity => {
  //       this.servers.push(new Server(port, 500));
  //     // });
  //   }
  //   else this.servers.push(this.waitingServers.pop());
  // }

  // // Removes a server from the active servers and adds it to the waiting queue.
  // killServer(server: Server) {
  //   this.servers.splice(this.servers.indexOf(server), 1);
  //   setTimeout(() => {
  //     this.waitingServers.push(server);
  //   }, 10000);
    
  // }

  // Makes a request to the API every 'interval' milliseconds.
  setInterval(interval) {
      this.currentIntervalId = setInterval(() => {
        let size = Math.floor(Math.random() * this.MAX_REQUEST_SIZE);
        this.http.get('/api/balance/' + size).subscribe(data => {
          this.showXAxisLabel = true;
          // this.servers = [];
          // this.waitingServers = [];

          let s = [];
          let w = [];
          
          Object.keys(data[0]).forEach(function(key) {
            s.push(new Server(Number(key), data[0][key]));
          });

          Object.keys(data[1]).forEach(function(key) {
            w.push(new Server(Number(key), data[1][key]));
          });
          this.servers = s;
          this.waitingServers = w;

          // this.servers = [...this.servers];
          // this.waitingServers = [...this.waitingServers];
            
            // if (this.servers.length != 0) {
            //   this.servers.forEach((server) => {
            //     if (server.port == port) {
            //       server.value++;
            //       if (server.capacity - size > 0) server.capacity -= size;
            //       else this.killServer(server);
            //     }
            //   });
            // }
            // else {
            //   // console.log("ASDFASDFASDFSDFASDFASDFASDF");
            //   this.spawnServer(this.portNumber++);
            // }
            // this.servers = [...this.servers];
            // this.waitingServers = [...this.waitingServers];
        });
    }, interval);
  }

  // Triggers whenever you click an element of the bar graph
  onSelect(event) {
    console.log(event);
    // this.setInterval(200);
  }

  burstTest() {
    clearInterval(this.currentIntervalId);
    this.setInterval(50);
  }

  slowRequests() {
    clearInterval(this.currentIntervalId);
    this.setInterval(5000);
  }

  regularRequestRate() {
    clearInterval(this.currentIntervalId);
    this.setInterval(400);
  }
}


