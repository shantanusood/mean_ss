import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart } from 'chart.js';

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
  options = false;

  profit = false;

  chart = [];
  barchart = [];
  constructor(private http: HttpClient) {}

  changeType(type: String){
    if(type==='Stocks'){
      this.stocks = true; this.etfs = false;this.index = false; this.mutual=false;this.futures=false;this.currency=false;this.options=false;
    }else if(type==='Etfs'){
      this.stocks = false; this.etfs = true;this.index = false; this.mutual=false;this.futures=false;this.currency=false;this.options=false;
    }else if(type==='Index'){
      this.stocks = false; this.etfs = false;this.index = true; this.mutual=false;this.futures=false;this.currency=false;this.options=false;
    }else if(type==='Mutual'){
      this.stocks = false; this.etfs = false;this.index = false; this.mutual=true;this.futures=false;this.currency=false;this.options=false;
    }else if(type==='Futures'){
      this.stocks = false; this.etfs = false;this.index = false; this.mutual=false;this.futures=true;this.currency=false;this.options=false;
    }else if(type==='Currency'){
      this.stocks = false; this.etfs = false;this.index = false; this.mutual=false;this.futures=false;this.currency=true;this.options=false;
    }else if(type==='Options'){
      this.stocks = false; this.etfs = false;this.index = false; this.mutual=false;this.futures=false;this.currency=false;this.options=true;
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
    this.barchart = [];
    var str:string = ((document.getElementById('quoteInput') as HTMLInputElement).value);
    const url = this.baseUrl + 'filters/^' + str + '/growth/-999';
    this.http.get(url).subscribe(res => {
      this.response = res;
      this.chart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: [2019, 2018, 2017],
          datasets: [
            {
              data: res[str],
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
    });

  }
  clickCash(){
    this.barchart = [];
    var str:string = ((document.getElementById('quoteInput') as HTMLInputElement).value);
    const url = this.baseUrl + 'filters/^' + str + '/cash/-999';
    this.http.get(url).subscribe(res => {
      this.response = res;
      this.chart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: [2019, 2018, 2017],
          datasets: [
            {
              data: res[str],
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
    });

  }
  clickProfit(){

    var str:string = ((document.getElementById('quoteInput') as HTMLInputElement).value);
    const url = this.baseUrl + 'filters/^' + str + '/profit';
    this.http.get(url).subscribe(res => {
      this.response = res;
      this.chart = new Chart('canvas', {
        type: 'bar',
        data: {
          labels: [2019, 2018, 2017, 2016],
          datasets: [
            {
              data: res[str][0],
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
              ticks: {
                beginAtZero: true
              },
              display: true
            }],
          }
        }
      });
      this.barchart = new Chart('canvas2', {
        type: 'line',
        data: {
          labels: [2019, 2018, 2017],
          datasets: [
            {
              data: res[str][1],
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
    });

  }
  clickRatio(){
    this.barchart = [];
    var str:string = ((document.getElementById('quoteInput') as HTMLInputElement).value);
    const url = this.baseUrl + 'filters/^' + str + '/ratio';
    this.http.get(url).subscribe(res => {
      this.response = res;
      this.chart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: [2019, 2018, 2017, 2016],
          datasets: [
            {
              //label: 'Ratio',
              data: res[str],
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
    });

  }
  clickPerformance(){
    const url = this.baseUrl + 'filters/^' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/perf/ann';
    const url2 = this.baseUrl + 'filters/^' + ((document.getElementById('quoteInput') as HTMLInputElement).value) + '/perf/trail';
    this.http.get(url).subscribe(res => {
      let keys : string[] = [];
      let values : string[] = [];
      Object.keys(res).forEach(function(key) {
        values.push(res[key]);
        keys.push(key);
      });
      this.chart = new Chart('canvas', {
        type: 'bar',
        data: {
          labels: keys,
          datasets: [
            {
              //label: 'Ratio',
              data: values,
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
    });
    this.http.get(url2).subscribe(res => {
      let keys : string[] = [];
      let values : string[] = [];
      Object.keys(res).forEach(function(key) {
        values.push(res[key]);
        keys.push(key);
      });
      this.barchart = new Chart('canvas2', {
        type: 'bar',
        data: {
          labels: keys,
          datasets: [
            {
              //label: 'Ratio',
              data: values,
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
