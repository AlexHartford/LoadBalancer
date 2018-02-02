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

  private MAX_REQUEST_SIZE: number = 25; // max size a request can request

  // plot options
  title = 'AR Social Media Load Balancer';
  view: any[] = [700, 400];
  showXAxis = true;
  showYAxis = true;     
  gradient = false;     
  showLegend = true;       
  showXAxisLabel = true;        
  xAxisLabel = 'Server';        
  showYAxisLabel = true;        
  yAxisLabel = 'Number of Requests';
  colorScheme = {
    domain: ['#0C0032', '#190061', '#240090', '#3500D3', '#282828']
  };

  constructor(private http: HttpClient) {
    // for (let i = 0; i < 5; i++) this.spawnServer('Server ' + i, i, 1, 25);
    // this.spawnServer(this.portNumber++);
    this.servers.push(new Server(3001, 500));
    let yolo = this.servers;  // because apparently it's illegal to put { this.servers }
    Object.assign(this, { yolo });
    this.setInterval(750);
  }
  
  // Spawns a server if there are no extra servers waiting.  Otherwise grab a server off the waiting queue.
  spawnServer(port: number) {
    if (this.waitingServers.length == 0) {
      this.http.get<number>('/api/server/' + port).subscribe(capacity => {
        this.servers.push(new Server(port, capacity));
      });
    }
    else this.servers.push(this.waitingServers.pop());
  }

  // Removes a server from the active servers and adds it to the waiting queue.
  killServer(server: Server) {
    this.servers.splice(this.servers.indexOf(server), 1);
    this.waitingServers.push(server);
  }

  // Makes a request to the API every 'interval' milliseconds.
  // TODO: Stuck here right now.  We need to have the back end tell the front end
  // when to add / remove servers from the chart.
  setInterval(interval) {
      setInterval(() => {
        let size = Math.floor(Math.random() * this.MAX_REQUEST_SIZE);
        this.http.get<number>('/api/balance/' + size).subscribe(port => {
            
            if (this.servers.length != 0) {
              this.servers.forEach((server) => {
                if (server.port == port) {
                  server.value++;
                  if (server.capacity - size > 0) server.capacity -= size;
                  else this.killServer(server);
                }
              });
            }
            else this.spawnServer(this.portNumber++);

            this.servers = [...this.servers];
            this.waitingServers = [...this.waitingServers];
        });
    }, interval);
  }

  // Triggers whenever you click an element of the bar graph
  onSelect(event) {
    console.log(event);
    this.killServer(this.servers[0]);
    this.spawnServer(this.portNumber++);
    // this.setInterval(200);
  }
}


