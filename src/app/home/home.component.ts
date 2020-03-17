import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  readonly baseUrl = 'http://192.168.2.229:5000/';
  response: any;

  stocks = false;
  etfs = false;
  index = false;
  mutual = false;
  futures = false;
  currency = false;
  options = false;

  profit = false;
  
  chart_title: string = "";
  barchart_title: string = "";

  chart = [];
  barchart = [];
  constructor(private http: HttpClient) {}

  changeType(type: string){
    if (type === 'Stocks'){
      this.stocks = true; this.etfs = false; this.index = false; this.mutual = false; this.futures = false; this.currency = false; this.options = false;
    }else if (type === 'Etfs'){
      this.stocks = false; this.etfs = true; this.index = false; this.mutual = false; this.futures = false; this.currency = false; this.options = false;
    }else if (type === 'Index'){
      this.stocks = false; this.etfs = false; this.index = true; this.mutual = false; this.futures = false; this.currency = false; this.options = false;
    }else if (type === 'Mutual'){
      this.stocks = false; this.etfs = false; this.index = false; this.mutual = true; this.futures = false; this.currency = false; this.options = false;
    }else if (type === 'Futures'){
      this.stocks = false; this.etfs = false; this.index = false; this.mutual = false; this.futures = true; this.currency = false; this.options = false;
    }else if (type === 'Currency'){
      this.stocks = false; this.etfs = false; this.index = false; this.mutual = false; this.futures = false; this.currency = true; this.options = false;
    }else if (type === 'Options'){
      this.stocks = false; this.etfs = false; this.index = false; this.mutual = false; this.futures = false; this.currency = false; this.options = true;
    }

  }

  // tslint:disable-next-line: variable-name
  charting(data_input, labels_input, chart_type, canvas_id){
    return new Chart(canvas_id, {
      type: chart_type,
      data: {
        labels: labels_input,
        datasets: [
          {
            data: data_input,
            borderColor: '#4CAF50',
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
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
    this.chart_title = "% Revenue Growth";
    this.barchart_title = "";
    this.barchart = [];
    var str: string = ((document.getElementById('quoteInput') as HTMLInputElement).value);
    const url = this.baseUrl + 'filters/^' + str + '/growth/-999';
    this.http.get(url).subscribe(res => {
      this.response = res;
      this.chart = this.charting(res[str], [2019, 2018, 2017], 'line', 'canvas');
    });

  }
  clickCash(){
    this.chart_title = "% Free Cash Growth";
    this.barchart_title = "";
    this.barchart = [];
    var str: string = ((document.getElementById('quoteInput') as HTMLInputElement).value);
    const url = this.baseUrl + 'filters/^' + str + '/cash/-999';
    this.http.get(url).subscribe(res => {
      this.response = res;
      this.chart = this.charting(res[str], [2019, 2018, 2017], 'line', 'canvas');
    });

  }
  clickProfit(){
    this.chart_title = "Net Profits";
    this.barchart_title = "% Profit Growth";
    var str: string = ((document.getElementById('quoteInput') as HTMLInputElement).value);
    const url = this.baseUrl + 'filters/^' + str + '/profit';
    this.http.get(url).subscribe(res => {
      this.response = res;
      this.chart = this.charting(res[str][0], [2019, 2018, 2017, 2016], 'bar', 'canvas');
      this.barchart = this.charting(res[str][1], [2019, 2018, 2017], 'line', 'canvas2');
    });

  }
  clickRatio(){
    this.chart_title = "Ratio";
    this.barchart_title = "";
    this.barchart = [];
    var str: string = ((document.getElementById('quoteInput') as HTMLInputElement).value);
    const url = this.baseUrl + 'filters/^' + str + '/ratio';
    this.http.get(url).subscribe(res => {
      this.response = res;
      this.chart = this.charting(res[str], [2019, 2018, 2017, 2016], 'line', 'canvas');
    });

  }
  clickPerformance(){
    this.chart_title = "Yearly % Growth";
    this.barchart_title = "Cumulative % Growth";
    const url = this.baseUrl + 'filters/^' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/perf/ann';
    const url2 = this.baseUrl + 'filters/^' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/perf/trail';
    this.http.get(url).subscribe(res => {
      let keys : string[] = [];
      let values : string[] = [];
      Object.keys(res).forEach(function(key) {
        values.push(res[key]);
        keys.push(key);
      });
      this.chart = this.charting(values, keys, 'bar', 'canvas');
    });
    this.http.get(url2).subscribe(res => {
      let keys : string[] = [];
      let values : string[] = [];
      Object.keys(res).forEach(function(key) {
        values.push(res[key]);
        keys.push(key);
      });
      this.barchart = this.charting(values, keys, 'bar', 'canvas2');
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
    this.chart_title = "Volume";
    this.barchart_title = "Adj Close change";
    const url = this.baseUrl + 'filters/^' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/hist';
    this.http.get(url).subscribe(res => {
      this.chart = this.charting(res['Adj Close**'], res['Date'], 'line', 'canvas2');
      this.barchart = this.charting(res['Volume'], res['Date'], 'bar', 'canvas');
    });
  }
  clickSustainability(){
    const url = this.baseUrl + 'filters/' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/ratio';
    this.http.get(url).subscribe(res => {
      this.response = res;
    });
  }
}
