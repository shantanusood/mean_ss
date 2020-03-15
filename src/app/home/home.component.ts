import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  readonly baseUrl = 'http://localhost:5000/';
  response: any;

  stocks = false;
  etfs = false;
  index = false;
  mutual = false;
  futures = false;
  currency = false;

  constructor(private http: HttpClient) {}

  changeType(type: String){
    if(type==='Stocks'){
      this.stocks = true; this.etfs = false;this.index = false; this.mutual=false;this.futures=false;this.currency=false;
    }else if(type==='Etfs'){
      this.stocks = false; this.etfs = true;this.index = false; this.mutual=false;this.futures=false;this.currency=false;
    }else if(type==='Index'){
      this.stocks = false; this.etfs = false;this.index = true; this.mutual=false;this.futures=false;this.currency=false;
    }else if(type==='Mutual'){
      this.stocks = false; this.etfs = false;this.index = false; this.mutual=true;this.futures=false;this.currency=false;
    }else if(type==='Futures'){
      this.stocks = false; this.etfs = false;this.index = false; this.mutual=false;this.futures=true;this.currency=false;
    }else if(type==='Currency'){
      this.stocks = false; this.etfs = false;this.index = false; this.mutual=false;this.futures=false;this.currency=true;
    }

  }

  ngOnInit() {
  }

  clickQuote() {
    const url = this.baseUrl + 'data/quote/' + ((document.getElementById('quoteInput') as HTMLInputElement).value);
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickBalSheet(){
    const url = this.baseUrl + 'data/bs/' + ((document.getElementById('quoteInput') as HTMLInputElement).value);
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickFinancial(){
    const url = this.baseUrl + 'data/fin/' + ((document.getElementById('quoteInput') as HTMLInputElement).value);
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickCashFlow(){
    const url = this.baseUrl + 'data/cf/' + ((document.getElementById('quoteInput') as HTMLInputElement).value);
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickGrowth(){
    const url = this.baseUrl + 'filters/' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/growth/-999';
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickCash(){
    const url = this.baseUrl + 'filters/' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/cash/-999';
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickProfit(){
    const url = this.baseUrl + 'filters/' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/profit';
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickRatio(){
    const url = this.baseUrl + 'filters/' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/ratio';
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickPerformance(){
    const url = this.baseUrl + 'filters/' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/ratio';
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickHoldings(){
    const url = this.baseUrl + 'filters/' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/ratio';
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickRisk(){
    const url = this.baseUrl + 'filters/' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/ratio';
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickHistory(){
    const url = this.baseUrl + 'filters/' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/ratio';
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
  clickSustainability(){
    const url = this.baseUrl + 'filters/' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/ratio';
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
}
