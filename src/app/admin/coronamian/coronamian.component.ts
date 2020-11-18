import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Chart } from "chart.js";
import { CoronaserviceService } from "services/coronaservice.service";
import { AppSettings } from 'src/app/AppSettings';

@Component({
  selector: "app-coronamian",
  templateUrl: "./coronamian.component.html",
  styleUrls: ["./coronamian.component.css"]
})
export class CoronamianComponent implements OnInit {
  readonly baseUrl = AppSettings.baseUrl;
  obj: object;
  data: object;
  page: String;
  due_date:String;
  type: String;
  val:String = "";
  roleslist: boolean = false;
  newuser: boolean = false;
  tasks: boolean = false;
  default: boolean = true;

  highbug:boolean = false;
  medbug:boolean = false;
  lowbug: boolean = false;
  date = new Date();
  openStyle: boolean = false;
  openfeat: boolean = false;

  constructor(private http: HttpClient, private serv: CoronaserviceService) {

  }

  chart = [];


  ngOnInit() {
    this.serv.currentMessage.subscribe(message => {
        if(message==='Vol'){
          this.roleslist = true;
          this.newuser = false;
          this.tasks = false;
          this.default = false;
          this.highbug = false;
          this.medbug = false;
          this.lowbug = false;
          this.openStyle = false;
          this.openfeat = false;
        }else if(message==='Chart'){
          this.newuser = true;
          this.roleslist = false;
          this.tasks = false;
          this.default = false;
          this.highbug = false;
          this.medbug = false;
          this.lowbug = false;
          this.openStyle = false;
          this.openfeat = false;
        }else if(message==='Tasks'){
          this.newuser = false;
          this.roleslist = false;
          this.tasks = true;
          this.default = false;
          this.highbug = false;
          this.medbug = false;
          this.lowbug = false;
          this.openStyle = false;
          this.openfeat = false;
        }else if(message==='high'){
          this.newuser = false;
          this.roleslist = false;
          this.tasks = false;
          this.default = false;
          this.highbug = true;
          this.medbug = false;
          this.lowbug = false;
          this.openStyle = false;
          this.openfeat = false;
        }else if(message==='medium'){
          this.newuser = false;
          this.roleslist = false;
          this.tasks = false;
          this.default = false;
          this.highbug = false;
          this.medbug = true;
          this.lowbug = false;
          this.openStyle = false;
          this.openfeat = false;
        }else if(message==='low'){
          this.newuser = false;
          this.roleslist = false;
          this.tasks = false;
          this.default = false;
          this.highbug = false;
          this.medbug = false;
          this.lowbug = true;
          this.openStyle = false;
          this.openfeat = false;
        }else if(message==='style'){
          this.newuser = false;
          this.roleslist = false;
          this.tasks = false;
          this.default = false;
          this.highbug = false;
          this.medbug = false;
          this.lowbug = false;
          this.openStyle = true;
          this.openfeat = false;
        }else if(message==='func'){
          this.newuser = false;
          this.roleslist = false;
          this.tasks = false;
          this.default = false;
          this.highbug = false;
          this.medbug = false;
          this.lowbug = false;
          this.openStyle = false;
          this.openfeat = true;
        }
    });
    this.http.get(this.baseUrl + "data/bug/get").subscribe((data) => {
      this.data = data;
  });
  }
  getTasks(data: object){
    return data['tasks']
  }
  getHigh(data: object){
    return data['high']
  }
  getMedium(data: object){
    return data['medium']
  }
  getLow(data: object){
    return data['low']
  }
  getStyle(data: object){
    return data['style']
  }
  getFunctional(data: object){
    return data['functional']
  }
  selectPage(value: String) {
    this.page = value;
    console.log(this.page);
   }
   selectType(value: String) {
    this.type = value;
    console.log(this.type);
   }
   changeDueDate(){
     this.type = (document.getElementById("due_date") as HTMLInputElement).value;
   }
  add(type: String){
    this.obj = {
      page : this.page,
      description: (document.getElementById("description") as HTMLInputElement).value,
      type: this.type
    }
    this.http.post( this.baseUrl +
        "data/bug/add/"+type, this.obj)
    .subscribe((data) => {
      this.data = data;

    });
  }
  delete(_page: String, _desc:String, _type:String, type: String){
    this.obj = {
      page : _page,
      description: _desc,
      type: _type
    }
    this.http
    .post(
      this.baseUrl +
        "data/bug/delete/"+type, this.obj)
    .subscribe((data) => {
        this.data = data;
    });
  }
}
