import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxChartsModule } from '@swimlane/ngx-charts';
// import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
// import 'rjxs/add/operator/map';

import { servers } from './servers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  interval = 750;

  constructor(private http: HttpClient) {
    Object.assign(this, {servers});
    setInterval(() => {
            this.http.get<any[]>('/api/balance').subscribe(data => {
                data.forEach((value, index) => {
                    this.servers[index].value += value;
                });
                this.servers = [...this.servers];
            });
        }, this.interval);
  }

  title = 'AR Social Media Load Balancer';
  apiURL = 'http://localhost:3000';
  data: any = {};

  view: any[] = [700, 400];

  servers: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Server';
  showYAxisLabel = true;
  yAxisLabel = 'Number of Requests';

  colorScheme = {
    domain: ['#0C0032', '#190061', '#240090', '#3500D3', '#282828']
  };
  
  onSelect(event) {
    console.log(event);
  }
}


