import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css']
})
export class HealthComponent implements OnInit {

  readonly baseUrl = 'http://1d00d09b.ngrok.io/';
  response: any;

  constructor(private http: HttpClient) {}

  getEtfs(){
    const url = this.baseUrl + 'api/test';
    this.http.get(url).subscribe(res => {
      this.response = res;
    });

  }
  ngOnInit() {
  }

}
