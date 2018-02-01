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

  private servers: Server[];

  constructor(private http: HttpClient) {
    // Object.assign(this, {servers});
    Object.assign(this, this.servers);
    setInterval(750);
  }
  
  spawnServer() {
    // servers.push(new Server())
  }

  killServer() {

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
}


