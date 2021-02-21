
import { Component, OnInit, Input, SimpleChanges, OnChanges } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CoronaserviceService } from "services/coronaservice.service";
import { AppSettings } from 'src/app/AppSettings';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnChanges {
  chart_title: String = "";
  description:string = "";

  dt: object[];
  dt_activity: object[];
  ticker: object;
  readonly baseUrl = AppSettings.baseUrl;
  @Input()
  nameSel: string;
  @Input()
  refreshed: string;
  selectedDate: String;
  selectedUser: any;
  msg: string = "spy";
  constructor(private http: HttpClient, private serv: CoronaserviceService) {}

  chart = [];

  ngOnChanges(changes: SimpleChanges) {
    this.selectedUser = changes.nameSel;
    //this.ngOnInit();
  }

  ngOnInit() {
    this.serv.currentMessage.subscribe(message => {
      this.msg = message;
      if(this.msg=='Activity'){
        this.http.get(this.baseUrl + "data/"+this.nameSel+"/notification/get").subscribe((data) => {
          this.dt_activity = data as object[];
        });
      }else{
        this.dt_activity = [];
        this.http.get(this.baseUrl + "data/"+this.nameSel+"/monitoring/raw").subscribe((data) => {
          this.dt = data as object[];
          this.dt.forEach(vals =>{
            if(vals['ticker']===this.msg){
              this.ticker = vals['positions']
            }
          });
        });
      }
    });
  }

  activitySize(activity: object[]){
    return activity.length;
  }

  process(tickerdata: object): object[] {
    var retVal: object[] = new Array();

    for(var k in tickerdata){
      var call: string[] = tickerdata[k]['call']
      var put: string[] = tickerdata[k]['put']
      var exp: string[] = tickerdata[k]['exp']
      var coll: string[] = tickerdata[k]['coll']
      var prem: string[] = tickerdata[k]['prem']

      if(call.length>0){
        for(var s in call){
          var trs: string[] = new Array();
          trs.push(this.msg);
          if(coll[s]==="0"){
            trs.push("Covered Call");
            trs.push(exp[s]);
            trs.push(coll[s]);
            trs.push(call[s]);
            trs.push("-");
            trs.push(prem[s]);
          }else {
            if(call[s]==="0"){
              trs.push("Put Credit spread");
              trs.push(exp[s]);
              trs.push(coll[s]);
              trs.push("-");
              trs.push(put[s]);
              trs.push(prem[s]);
            }else if(put[s]==="0"){
              trs.push("Call Credit spread");
              trs.push(exp[s]);
              trs.push(coll[s]);
              trs.push(call[s]);
              trs.push("-");
              trs.push(prem[s]);
            }else{
              trs.push("Iron Condor");
              trs.push(exp[s]);
              trs.push(coll[s]);
              trs.push(call[s]);
              trs.push(put[s]);
              trs.push(prem[s]);
            }
          }

          retVal.push(trs);
        }
      }
    }
    return retVal;
  }
  getDetails(x: Object){

    var keys= [];
    var vals= [];
    for (let key in x) {
      if(key != "date"){
        if(key != "ticker"){
          if(key != "status"){
            keys.push(key);
            vals.push(x[key]);
          }
        }
      }
    }
    var type = "";
    keys.forEach(x => {
      if(x == "cost"){
        type = x.toString();
      }
      if(x == "premium"){
        type = x.toString();
      }
    })
    return [type, keys, vals];
  }

  selectDate(value: String) {
    this.selectedDate = value;
   }
   filter(){
    this.http
    .get(
      this.baseUrl +
        "data/"+this.nameSel+"/notification/get/"+this.selectedDate+"/"
            +(document.getElementById("ticker") as HTMLInputElement).value).subscribe(ele => {
          this.dt_activity = ele as object[];
        });
   }

}
