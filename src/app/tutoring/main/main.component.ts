
import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Chart } from "chart.js";
import { CoronaserviceService } from "services/coronaservice.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  chart_title: String = "";
  description:string = "";

  val:String = "";
  baseUrl = "http://58fb7171.ngrok.io/";

  constructor(private http: HttpClient, private serv: CoronaserviceService) {}

  chart = [];

  ngOnInit() {
    this.serv.currentMessage.subscribe(message => {
        if(message==='Vol'){
          this.chart_title = "S&P 500 TTM Volume";
          this.description = "This chart represents the trailing twelve months value for the whatever it may"
                              +"This chart represents the trailing twelve months value for the whatever it"
                              +"This chart represents the trailing twelve months value for the whatever ";
          const url = this.baseUrl + 'filters/^^GSPC/hist';
          this.http.get(url).subscribe(res => {
            console.log(res);
            this.chart = this.charting(res['Volume'], res['Date'], 'bar');
          });
        }else if(message==='Chart'){
          this.chart_title = "S&P 500 TTM Adj Close change";
          this.description = "This chart represents the trailing twelve months VOLUME for the whatever it may"
                              +"This chart represents the trailing twelve months VOLUME for the whatever it"
                              +"This chart represents the trailing twelve months VOLUME for the whatever ";
          const url = this.baseUrl + 'filters/^^GSPC/hist';
          this.http.get(url).subscribe(res => {
            console.log(res);
            this.chart = this.charting(res['Adj Close**'], res['Date'], 'line');
          });
        }else{
          this.chart_title = "This is a test!";
          this.description = "This chart represents the trailing twelve months VOLUME for the whatever it may"
                              +"This chart represents the trailing twelve months VOLUME for the whatever it"
                              +"This chart represents the trailing twelve months VOLUME for the whatever ";
          const url = this.baseUrl + 'filters/^^GSPC/hist';
          this.http.get(url).subscribe(res => {
            console.log(res);
            this.chart = this.charting(res['Adj Close**'], res['Date'], 'line');
          });
        }
    });
  }


  charting(data_input, labels_input, chart_type) {
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
          xAxes: [
            {
              display: true,
              ticks: {
                fontColor: "wheat" // this here
              },
              gridLines: {
                color: "black",
                zeroLineColor: "wheat"
              }
            }
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                fontColor: "wheat"
              },
              gridLines: {
                color: "wheat",
                zeroLineColor: "wheat"
              }
            }
          ]
        }
      }
    });
  }
}
