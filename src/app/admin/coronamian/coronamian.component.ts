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
  deleteuser:boolean= false;
  question:String = "";
  answer:String = "";
  question_bool:boolean = false;

  public towns = [];
  public townSelected = "";

  highbug:boolean = false;
  medbug:boolean = false;
  lowbug: boolean = false;
  date = new Date();
  openStyle: boolean = false;
  openfeat: boolean = false;
  refreshed: number = 0;
  username: String;
  role_list: object[];
  signup_obj: object;
  newrole: String;
  checkuseer:boolean = false;
  userexists:string = "";
  user:string = "";
  questions:String = "";
  answers:String = "";
  pin: string;
  loading: boolean = false;
  signup:boolean = true;
  pin_bool:boolean = false;

  constructor(private http: HttpClient, private serv: CoronaserviceService) {
    this.http.get(this.baseUrl+'data/roles/get').subscribe((data) => {
      this.role_list = data as object[];
      this.role_list.forEach(d => {
        if(d['role']=='admin'){
          console.log("");
        }else{
          this.towns.push(d['userid']);
        }
      });
    });
  }

  deleteUser(){

    this.http.get(this.baseUrl+'data/deleteuser/'+this.townSelected).subscribe((data) => {
      console.log("deleted");
    });
  }
  chart = [];

  onClickRefresh(){
    this.refreshed = this.refreshed + 1;
  }

  onClickSignup(){
    this.checkuseer = false;
    this.loading = true;
    this.userexists = (document.getElementById("username") as HTMLInputElement).value;
    this.questions = ((document.getElementById("questions") as HTMLInputElement).value);
    this.answers = ((document.getElementById("answers") as HTMLInputElement).value);
    this.user = this.userexists;
    this.http.get(this.baseUrl+'data/roles/get').subscribe((data) => {
      this.role_list = data as object[];
      this.role_list.forEach(d => {
        if(this.userexists==d['userid']){
          this.checkuseer = true;
        }
      });
      if(this.checkuseer){
          this.loading = false;
        this.userexists = " taken, please try again!";
      }else{
        if(this.questions=="tenant"){
          this.newrole = "tenant";
        }else{
          this.newrole = "basictrader";
        }
        this.signup_obj = {
          userid: this.user,
          role: this.newrole,
          question: this.questions,
          answer: this.answers

        }
        this.http.post(this.baseUrl+'data/newuser', this.signup_obj).subscribe((data) => {
          console.log("done")
        });
        this.username = this.user;
        this.http.get(this.baseUrl + "data/"+this.username+"/getit").subscribe((data2) => {
          this.pin = data2['this'];
          this.pin_bool = true;
          this.signup = false;
          this.loading = false;
        });
      }
    });

  }

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
          this.deleteuser = false;
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
          this.deleteuser = false;
        }else if(message==='Del'){
          this.newuser = false;
          this.roleslist = false;
          this.tasks = false;
          this.default = false;
          this.highbug = false;
          this.medbug = false;
          this.lowbug = false;
          this.openStyle = false;
          this.openfeat = false;
          this.deleteuser = true;
        }else if(message==='Tasks'){
          this.newuser = false;
          this.deleteuser = false;
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
          this.deleteuser = false;
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
          this.deleteuser = false;
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
          this.deleteuser = false;
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
          this.deleteuser = false;
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
          this.deleteuser = false;
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
