import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HomeComponent } from '../home.component';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.css']
})
export class ResearchComponent implements OnInit {

  readonly baseUrl = 'http://localhost:5000/';
  ticker: string = "";
  type: string = "";

  private routeSub: Subscription;
  constructor(private route: ActivatedRoute, private http: HttpClient) {
  }


  chart_title = "";


  chart = [];

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
    this.routeSub = this.route.params.subscribe(params => {
      this.ticker = params['id'];
      this.type = params['type'];
    });
    if(this.type==='Stocks'){
      this.chart_title = "% Free Cash Growth";
      const url = this.baseUrl + 'filters/^' + this.ticker + '/cash/-999';
      this.http.get(url).subscribe(res => {
        this.chart = this.charting(res[this.ticker], [2019, 2018, 2017], 'line', 'canvas');
      });
    }else if (this.type === 'Etfs'){

    }else if (this.type === 'Mutual'){

    }else if (this.type === 'Options'){

    }

  }

}
