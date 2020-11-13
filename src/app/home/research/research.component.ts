import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HomeComponent } from '../home.component';
import { Chart } from 'chart.js';
import { AppSettings } from 'src/app/AppSettings';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.css']
})
export class ResearchComponent implements OnInit {

  readonly baseUrl = AppSettings.baseUrl;

  ticker: string = "";
  type: string = "";

  private routeSub: Subscription;
  constructor(private route: ActivatedRoute, private http: HttpClient) {
  }

  response = [];

  chart_title = [];
  table_title = [];

  cash = [];
  growth = [];
  profit_raw = [];
  profit_growth = [];
  ratio = [];
  hist_vol = [];
  hist = [];
  perf = [];
  perf_trail = [];
  hld = [];
  hld_weight = [];
  objectKeys = Object.keys;

  charting(data_input, labels_input, chart_type, canvas_id){
    return new Chart(canvas_id, {
      type: chart_type,
      data: {
        labels: labels_input,
        datasets: [
          {
            data: data_input,
            fill: false,
            borderColor: "wheat",
            backgroundColor: "wheat",
            pointHoverBackgroundColor: "wheat",
            pointHoverBorderColor: "wheat"
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            ticks: {
              fontColor: "wheat", // this here
            },
            gridLines: {
              color: 'black',
              zeroLineColor: 'wheat'
            }
          }],
          yAxes: [{
            display: true,
            ticks: {
              fontColor: "wheat", // this here
            },
            gridLines: {
              color: 'wheat',
              zeroLineColor: 'wheat'
            }
          }],
        }
      }
    });
  }

  getType():string{
    return this.type;
  }

  originalOrder = (a: any, b: any): number => {
    return 0;
  }
  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.ticker = params['id'];
      this.type = params['type'];
    });
    if(this.type==='Stocks'){

      this.table_title[0] = "Quote for "+this.ticker.toUpperCase();
      this.http.get(this.baseUrl + 'data/quote/' + this.ticker).subscribe(res => {
        this.response[0] = res;
      });
      this.table_title[1] = "Balance Sheet";
      this.http.get(this.baseUrl + 'data/bs/' + this.ticker).subscribe(res => {
        this.response[1] = res;
      });
      this.table_title[2] = "Income Statement";
      this.http.get(this.baseUrl + 'data/fin/' + this.ticker).subscribe(res => {
        this.response[2] = res;
      });
      this.table_title[3] = "Cash Flow";
      this.http.get(this.baseUrl + 'data/cf/' + this.ticker).subscribe(res => {
        this.response[3] = res;
      });
      this.chart_title[0] = "% Revenue Growth";
      this.http.get(this.baseUrl + 'filters/^' + this.ticker + '/growth/-999').subscribe(res => {
        this.growth = this.charting(res[this.ticker], [2019, 2018, 2017], 'line', 'growth');
      });
      this.chart_title[1] = "Net Profits";
      this.chart_title[2] = "% Profit Growth";
      this.http.get(this.baseUrl + 'filters/^' + this.ticker+ '/profit').subscribe(res => {
        this.profit_raw = this.charting(res[this.ticker][0], [2019, 2018, 2017, 2016], 'bar', 'profit_growth');
        this.profit_growth = this.charting(res[this.ticker][1], [2019, 2018, 2017], 'line', 'profit_raw');
      });
      this.chart_title[3] = "Ratio";
      this.http.get(this.baseUrl + 'filters/^' + this.ticker + '/ratio').subscribe(res => {
        this.ratio = this.charting(res[this.ticker], [2019, 2018, 2017, 2016], 'line', 'ratio');
      });
      this.chart_title[4] = "% Free Cash Growth";
      this.http.get(this.baseUrl + 'filters/^' + this.ticker + '/cash/-999').subscribe(res => {
        this.cash = this.charting(res[this.ticker], [2019, 2018, 2017], 'line', 'cash');
      });
      this.chart_title[5] = "Yearly % Growth";
      this.chart_title[6] = "Cumulative % Growth";
      this.http.get(this.baseUrl + 'filters/^' + this.ticker + '/hist').subscribe(res => {
        this.hist = this.charting(res['Adj Close**'], res['Date'], 'line', 'hist');
        this.hist_vol = this.charting(res['Volume'], res['Date'], 'bar', 'hist_vol');
      });
    }else if (this.type === 'Etfs' || this.type === 'Mutual'){
      this.table_title[0] = "Quote for "+this.ticker;
      this.http.get(this.baseUrl + 'data/quote/' + this.ticker).subscribe(res => {
        this.response[0] = res;
      });
      this.table_title[1] = "Risk Info";
      this.http.get(this.baseUrl + 'filters/^' + this.ticker + '/risk').subscribe(res => {
        this.response[1] = res;
      });
      this.chart_title[0] = "Yearly % Growth";
      this.chart_title[1] = "Cumulative % Growth";
      this.http.get(this.baseUrl + 'filters/^' + this.ticker + '/perf/ann').subscribe(res => {
        let keys : string[] = [];
        let values : string[] = [];
        Object.keys(res).forEach(function(key) {
          values.push(res[key]);
          keys.push(key);
        });
        this.perf = this.charting(values, keys, 'bar', 'perf');
      });
      this.http.get(this.baseUrl + 'filters/^' + this.ticker + '/perf/trail').subscribe(res => {
        let keys : string[] = [];
        let values : string[] = [];
        Object.keys(res).forEach(function(key) {
          values.push(res[key]);
          keys.push(key);
        });
        this.perf_trail = this.charting(values, keys, 'bar', 'perf_trail');
      });
      this.chart_title[5] = "Yearly % Growth";
      this.chart_title[6] = "Cumulative % Growth";
      this.http.get(this.baseUrl + 'filters/^' + this.ticker + '/hist').subscribe(res => {
        this.hist = this.charting(res['Adj Close**'], res['Date'], 'line', 'hist');
        this.hist_vol = this.charting(res['Volume'], res['Date'], 'bar', 'hist_vol');
      });
      this.table_title[2] = "Composition";
      this.http.get(this.baseUrl + 'filters/^' + this.ticker + '/hld/comp').subscribe(res => {
        this.response[2] = res;
      });
      this.chart_title[3] = "Composition by sector";
      this.http.get(this.baseUrl + 'filters/^' + this.ticker + '/hld/weight').subscribe(res => {
        this.hld_weight = this.charting(res['Percent'], res['Sector'], 'bar', 'hld_weight');
      });
      this.chart_title[2] = "Top 10 Holdings";
      this.http.get(this.baseUrl + 'filters/^' + this.ticker + '/hld').subscribe(res => {
        this.hld = this.charting(res['Assets'], res['Name'], 'bar', 'hld');
      });
    }else if (this.type === 'Options'){

    }

  }

}
