import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css']
})
export class HealthComponent implements OnInit {

  readonly baseUrl = 'http://c90bf576.ngrok.io/';
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
