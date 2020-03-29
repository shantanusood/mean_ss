import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css']
})
export class HealthComponent implements OnInit {

  readonly baseUrl = 'http://1d00d09b.ngrok.io/';

  stocks = true;
  etfs = false;
  type:string = '';

  response: any;

  constructor(private http: HttpClient) {}

  changeType(type: string){
    this.type = type;
    if (type === 'Stocks'){
      this.stocks = true; this.etfs = false;
    }else if (type === 'Etfs'){
      this.stocks = false; this.etfs = true;
    }
  }
  getEtfs(){
    const url = this.baseUrl + 'api/test';
    this.http.get(url).subscribe(res => {
      this.response = res;
    });

  }
  ngOnInit() {
  }

}
