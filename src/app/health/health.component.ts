import { Component, OnInit, Input, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../AppSettings';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chart } from 'chart.js';

export interface DialogData {
  type: string;
  view: object;
}

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css']
})
export class HealthComponent implements OnInit {

  readonly baseUrl = AppSettings.baseUrl;

  analysis_type = ['basics', 'ratios', 'incomechanges', 'balancesheetchanges', 'cashflowchanges',  'discountedcashflow', 'intValCustom']

  run_spinner: boolean = false;
  sectors: Object;
  parentSectors = [];
  subSectors = [];
  tickers = [];
  analysis_ret = [];
  dump_res: String = "";
  selectedParent: String = "Commodity";
  selectedsubsector: String = "All";
  selectedanalysis: String = "basics";
  selectedGraphLine: string = "none";
  view_type: object;

  chart_boolean: boolean = false;
  chart_title: string;
  values = [];
  analysis_values = new Set();
  selectOrder: String = "None";
  analysis_graphs = [];
  dates = new Set();

  sector_avg = [];

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit() {
    this.http.get(this.baseUrl + "data/getSectors").subscribe((data) => {
      this.sectors = data as object;
        for(var k in this.sectors){
          this.parentSectors.push(k);
        }
      });
  }
  selectParent(value: String) {
    this.selectedParent = value;
   }
   selectSubSector(value: String) {
    this.selectedsubsector = value;
   }
   selectAnalysisType(value: String) {
    this.selectedanalysis = value;
   }
   selectGraphLineType(value: string) {
    this.selectedGraphLine = value;
   }
   selectOrderBy(value: String){
     this.selectOrder = value;
   }
   getSubSectors(){
    this.http.get(this.baseUrl + "data/getSubSectors/"+this.selectedParent).subscribe((data) => {
      this.subSectors = data as object[];
      });
   }
   getTickers(){
    this.http.get(this.baseUrl + "data/metadata/stocks/USA/"+this.selectedParent+ "/"+ this.selectedsubsector).subscribe((data) => {
      this.tickers = data as object[];
      });
   }
   analyze(){
    this.run_spinner = true;
    this.http.post(this.baseUrl + "data/analyze/"+this.selectedParent+ "/"+ this.selectedsubsector + "/" + this.selectedanalysis,
      this.tickers).subscribe((data) => {
        this.tickers = data as object[];

        if(this.selectedanalysis == 'basics'){
        this.http.post(this.baseUrl + "data/analyze/sectors/" + this.selectedanalysis,
          this.tickers).subscribe((data_avg) => {
            this.sector_avg = data_avg as object[];
            console.log(data_avg)
        });
      }

        this.run_spinner = false;
      });
      this.http.post(this.baseUrl + "data/lines/"+this.selectedParent+ "/"+ this.selectedsubsector + "/" + this.selectedanalysis,
      this.tickers).subscribe((data) => {
        this.analysis_graphs = data as object[];
      });

   }

   tops(){
     var top_vals = [];
     for(let x=0;x<this.sector_avg.length;x++){
      top_vals.push(this.sector_avg[x][0]);
     }
     return top_vals;
   }

   getDropdownLines(ticker: String){
    for(var x in this.analysis_graphs){
      if(Object.keys(this.analysis_graphs[x])[0] == ticker){
        return this.analysis_graphs[x][Object.keys(this.analysis_graphs[x])[0]]
      }
     }

   }
   getAnalysisData(value: any){
    var ret = [];
    this.analysis_values = new Set();
     for(var k in value){
       if(k == this.selectedanalysis){
         for(var j in value[k]){
           this.analysis_values.add(j);
           ret.push([j, value[k][j]]);
         }
       }
     }
     return ret;
  }
  order(){
    this.tickers.sort((a: Object, b: Object) => {
      for (var x in a){
        if(x == this.selectedanalysis){
          for(var y in a[x]){
            if(y == this.selectOrder){
              if(Number(a[x][y]) > Number(b[x][y])){
                return -1;
              }else if(Number(a[x][y]) > Number(b[x][y])){
                return 1;
              }else{
                return 0;
              }
            }
          }
        }
      }
    });
   }
   graph(ticker: String, cat: String){
    if(this.selectedGraphLine.indexOf('/')!=-1){
      this.selectedGraphLine = this.selectedGraphLine.replace("/", "*&*")
    }
    this.http.post(this.baseUrl + "data/lines/"+this.selectedParent+ "/"+ cat + "/" + this.selectedanalysis
    + "/" + ticker + "/" + this.selectedGraphLine,
    this.tickers).subscribe((data) => {
      var value = data as object[];
      this.chart_title = String(ticker) + " - " + this.selectedGraphLine.replace("*&*", "/");
      this.chart = this.charting(value[1], value[0], 'line', 'canvas')
    });
   }

   chart:Chart = [];
   charting(data_input, labels_input, chart_type, canvas_id){
    Chart.helpers.each(Chart.instances, function (instance) {
      if (instance.chart.canvas.id === chart_type) {
        instance.destroy();
        return;
      }
    });
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

   freecash(freecash: object[]){

    const dialogRef = this.dialog.open(Dialog_hth, {
      maxHeight: '800px',
      autoFocus: false,
      data: {type: "discountedcashflow", view: [freecash[0][1], freecash[1][1], freecash[2][1], freecash[3][1]]}
    });

  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  styleUrls: ['./view.css'],
  templateUrl: './view.html'
})
export class Dialog_hth {
  constructor(
    public dialogRef: MatDialogRef<Dialog_hth>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}


    onNoClick(): void {

      this.dialogRef.close();

    }


}
