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

  constructor(private http: HttpClient) {
    Object.assign(this, {servers});
    setInterval(() => {
            this.http.get<any[]>('http://localhost:3000/api/test').subscribe(data => {
                data.forEach((value, index) => {
                    this.servers[index].value = value;
                });
                this.servers = [...this.servers];
            });
        }, 750);
  }

  title = 'AR Social Media Load Balancer';
  apiURL = 'http://localhost:3000';
  data: any = {};

  view: any[] = [700, 400];

  servers: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Server';
  showYAxisLabel = true;
  yAxisLabel = 'Number of Requests';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  
  onSelect(event) {
    console.log(event);
  }

  sendRequest() {
    // const headers = new Headers({'Content-Type': 'application/json'}); 
    // const options = new RequestOptions({ headers: headers });
    this.http.get(this.apiURL)
       .toPromise()
       .then(response => console.log(response));
  }


}


