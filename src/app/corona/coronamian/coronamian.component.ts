import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-coronamian',
  templateUrl: './coronamian.component.html',
  styleUrls: ['./coronamian.component.css']
})
export class CoronamianComponent implements OnInit {

  chart_title:String= "This will be the chart title";

  constructor(private http: HttpClient) {}

  ngOnInit() {
  }

  charting(data_input, labels_input, chart_type){
    return new Chart("viruscanvas", {
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
              fontColor: "wheat",
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

}
