import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../AppSettings';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css']
})
export class HealthComponent implements OnInit {

  readonly baseUrl = AppSettings.baseUrlAnalytics;

  analysis_type = ['basics', 'ratios', 'incomechanges', 'balancesheetchanges', 'cashflowchanges',  'discountedcashflow']

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
  view_type: object;

  chart_boolean: boolean = false;
  chart_title: string = "";
  values = [];
  analysis_values = new Set();
  selectOrder: String = "None";
  dates = new Set();

  constructor(private http: HttpClient) {}

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
        this.run_spinner = false;
      });
   }
   getAnalysisData(value: any){
     var ret = [];
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



}
