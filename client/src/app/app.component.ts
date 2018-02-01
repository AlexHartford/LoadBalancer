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

  constructor(private http: HttpClient) {
    for (let i = 0; i < 5; i++) this.spawnServer('server ' + i, i, 1, 25);
    let yolo = this.servers;
    Object.assign(this, {yolo});
    
    // Object.assign(this, this.servers);
    this.setInterval(750);
  }
  
  spawnServer(name: string, port: number, value: number, capacity: number) {
    this.servers.push(new Server(name, port, value, capacity));
  }

  killServer(server: Server) {
    this.servers.splice(this.servers.indexOf(server), 1);
  }

  setInterval(interval) {
      setInterval(() => {
        this.http.get<any[]>('/api/balance').subscribe(data => {
            data.forEach((value, index) => {
                this.servers[index].value += value;
            });
            this.servers = [...this.servers];
        });
    }, interval);
  }

  onSelect(event) {
    console.log(event);
  }

  title = 'AR Social Media Load Balancer';
  data: any = {};
  view: any[] = [700, 400];

  // plot options
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
}


