import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  response: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
  }

  clickQuote() {
    const url = 'http://localhost:5000/data/quote/' + ((document.getElementById('quoteInput') as HTMLInputElement).value);
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickBalSheet(){
    const url = 'http://localhost:5000/data/bs/' + ((document.getElementById('quoteInput') as HTMLInputElement).value);
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickFinancial(){
    const url = 'http://localhost:5000/data/fin/' + ((document.getElementById('quoteInput') as HTMLInputElement).value);
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickCashFlow(){
    const url = 'http://localhost:5000/data/cf/' + ((document.getElementById('quoteInput') as HTMLInputElement).value);
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickGrowth(){
    const url = 'http://localhost:5000/filters/' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/growth/-999';
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickCash(){
    const url = 'http://localhost:5000/filters/' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/cash/-999';
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickProfit(){
    const url = 'http://localhost:5000/filters/' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/profit';
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickRatio(){
    const url = 'http://localhost:5000/filters/' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/ratio';
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
}
