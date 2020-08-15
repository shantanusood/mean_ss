import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart } from 'chart.js';
//import { GridOptions, ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {

  constructor(private http: HttpClient) {

  }
  readonly baseUrl = 'http://192.168.1.162:5000/';
  data: object[];
  chart:Chart = [];
  frontMonth:Chart = [];
  nextMonth:Chart = [];
  loading = true;

  dataof: object[];
  index: number = 5;
  type: string = "total";
  perc_change: string = " ";
  monthone: string;
  monthtwo: string;

  gains: object[];

  current: object[];

  changeType(type: string){
    if (type === 'fidelity'){
      this.index = 1;
      this.type = type;
    }else if (type === 'robinhood'){
      this.index = 2;
      this.type = type;
    }else if (type === 'tastyworks'){
      this.index = 3;
      this.type = type;
    }else if (type === 'retirement'){
      this.index = 4;
      this.type = type;
    }else if (type === 'total'){
      this.index = 5;
      this.type = type;
    }
    this.charting();
  }
  ngOnInit() {

    this.gainsProgress();
    this.currentProgress();
    this.charting();
  }

  gainsProgress(){

    this.http
      .get(
        this.baseUrl +
          "data/progress/gains")
      .subscribe((data) => {
        this.dataof = data as object[];
        this.monthone = this.dataof[3][0];
        this.monthtwo = this.dataof[3][1];
        this.frontMonth = new Chart("canvas_front", {
          type: "bar",
          data: {
            labels: this.dataof[0],
            datasets: [
              {
                data: this.dataof[1],
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
        this.nextMonth = new Chart("canvas_next", {
          type: "bar",
          data: {
            labels: this.dataof[0],
            datasets: [
              {
                data: this.dataof[2],
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
      });
  }

  currentProgress(){
    this.loading = true;
    this.http
      .get(
        this.baseUrl +
          "data/progress/current")
      .subscribe((data) => {
        console.log(data);
        this.current = data as object[];
        this.loading = false;
      });
  }

  addDataHistoric(){
    this.http
      .get(
        this.baseUrl +
          "data/daily/" +
          (document.getElementById("fidelity") as HTMLInputElement).value +
          "/" +
          (document.getElementById("robinhood") as HTMLInputElement).value +
          "/" +
          (document.getElementById("tastyworks") as HTMLInputElement).value +
          "/" +
          (document.getElementById("retirement") as HTMLInputElement).value +
          "/" +
          (document.getElementById("fidelity_c") as HTMLInputElement).value +
          "/" +
          (document.getElementById("robinhood_c") as HTMLInputElement).value +
          "/" +
          (document.getElementById("tastyworks_c") as HTMLInputElement).value +
          "/" +
          (document.getElementById("retirement_c") as HTMLInputElement).value
      )
      .subscribe((data) => {
        console.log(data);
      });
  }

  retValGreater(val: string, num: string):boolean{
    if(parseFloat(val) > parseFloat(num)){
      return true ;
    }else{
      return false ;
    }

  }

  charting() {
    this.perc_change = "";
    this.http.get(this.baseUrl + "data/daily").subscribe(res => {
      this.data = res as object[];
      this.chart = new Chart("canvas", {
        type: "line",
        data: {
          labels: this.data[0]['date'],
          datasets: [
            {
              data: this.data[this.index][this.type],
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
    });

  }

  filterHist(filter: string){
    this.http.get(this.baseUrl + "data/daily/" + this.index + "/" + this.type + "/" + filter)
      .subscribe((res) => {
        this.data = res as object[];
        this.perc_change = this.data['change'];
        this.chart = new Chart("canvas", {
          type: "line",
          data: {
            labels: this.data['date'],
            datasets: [
              {
                data: this.data[this.type],
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
      });
  }

}
