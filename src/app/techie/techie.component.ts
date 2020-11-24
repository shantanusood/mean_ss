import {formatDate} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../AppSettings';
import { CoronaserviceService } from '../coronaservice.service';

@Component({
  selector: 'app-techie',
  templateUrl: './techie.component.html',
  styleUrls: ['./techie.component.css']
})
export class TechieComponent implements OnInit {

  admin_inprogress: object[];
  cur_property:String;
  address:String;
  workorder: object[];
  workorder_selected: object[];
  workorder_bool:boolean;
  myproperty: object;
  public towns = [];
  public townSelected;
  username: string;
  roles: string;
  role_list: object[];
  loading:boolean = false;
  properties;
  refreshed: number = 0;
  data: object;
  type:string = "";
  obj: object;
  date = new Date();
  selectedOption: String;

  readonly baseUrl = AppSettings.baseUrl;

  constructor(private http: HttpClient, private ds: CoronaserviceService) {

    this.ds.current.subscribe(message => this.username = message);
    this.http.get(this.baseUrl+'data/roles/get').subscribe((data) => {
      this.role_list = data as object[];
      this.role_list.forEach(d => {
        if(d['userid']===this.username){
          this.roles = d['role'];
        }
        console.log(d['userid']);
        console.log(d['role']);
      });
    });
  }

  selectOption(value: String) {
   this.selectedOption = value;
  }
  required_msg:String;
  required_location:String;
  required_desc:String;
  workorderclick(){
    if(this.selectedOption==undefined || this.selectedOption.length==0){
      this.required_msg = "*";
    }else{
      this.required_msg = "";
    }
    if((document.getElementById("location") as HTMLInputElement).value.length==0){
      this.required_location = "*";
    }else{
      this.required_location = "";
    }
    if((document.getElementById("description") as HTMLInputElement).value.length==0){
      this.required_desc = "*";
    }else{
      this.required_desc = "";
    }
    if(this.required_msg || this.required_location || this.required_desc ){
      console.log("requirement not fulfilled");
    }else{
      this.addToWorkOrder();
    }
  }
  addToWorkOrder(){
    this.loading = true;
    this.obj = {
      emergency: this.selectedOption,
			location: (document.getElementById("location") as HTMLInputElement).value,
			description: (document.getElementById("description") as HTMLInputElement).value,
      submitby: this.username,
      address: this.address,
			submitdate: formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en'),
      status: "In progress"
    };
    this.http.post(this.baseUrl + "properties/"+this.cur_property+"/workorder", this.obj).subscribe((data) => {
      this.workorder = data['workorders'];
      this.loading = false;

    });
  }
  ngOnInit() {
    this.ds.current.subscribe(message => this.username = message);
    this.http.get(this.baseUrl +'properties/get').subscribe((data) => {
      this.properties = data as object[];
      this.workorder = data['workorders'];
      console.log(this.workorder);
      this.properties.forEach(d => {
          this.towns.push(d);
      });
    });
    this.http.get(this.baseUrl +'data/'+this.username+'/rental/history').subscribe((data) => {
      this.myproperty = data as object;
      this.cur_property = this.myproperty['propetyname'];
      this.address = this.myproperty['address'];
      this.http.get(this.baseUrl +'properties/'+this.myproperty['propetyname']+'/get').subscribe((data) => {
        this.workorder = data['workorders'];
        if(this.workorder.length==0){
          this.workorder_bool = false;
        }else{
          this.workorder_bool = true;
        }
      });
    });
    this.http.get(this.baseUrl +'properties/inprogress').subscribe((data) => {
      this.workorder_selected = data as object[];
    });
  }

  onClickRefresh(){
    this.refreshed = this.refreshed + 1;
    this.http
    .get(
      this.baseUrl +
        "properties/"+this.townSelected+"/get")
    .subscribe((data) => {
      this.workorder_selected = data['workorders'];
      this.data = data;
    });
  }
  getEmergency(workorder: object[], index: number){
    if(workorder.length>0){
      return workorder[index]['emergency']
    }else{
      return "NA";
    }
  }
  getLocation(workorder: object[], index: number){
    if(workorder.length>0){
      return workorder[index]['location']
    }else{
      return "NA";
    }
  }
  getDescription(workorder: object[], index: number){
    if(workorder.length>0){
      return workorder[index]['description']
    }else{
      return "NA";
    }
  }
  getSubmitBy(workorder: object[], index: number){
    if(workorder.length>0){
      return workorder[index]['submitby']
    }else{
      return "NA";
    }
  }
  getAddress(workorder: object[], index: number){
    if(workorder.length>0){
      return workorder[index]['address']
    }else{
      return "NA";
    }
  }
  del_obj;
  compl_obj;
  delete(_address: String, _time:String,){
    this.loading = true;
    this.del_obj = {
      address : _address,
      time: _time
    }
    this.http
    .post(
      this.baseUrl +
        "properties/workorder/delete", this.del_obj)
    .subscribe((data) => {
      this.http.get(this.baseUrl +'properties/inprogress').subscribe((data) => {
        this.workorder_selected = data as object[];
      });
      this.loading = false;
    });
  }
  completed(_address: String, _time:String,){
    this.loading = true;
    this.compl_obj = {
      address : _address,
      time: _time
    }
    this.http
    .post(
      this.baseUrl +
        "properties/workorder/completed", this.compl_obj)
    .subscribe((data) => {
      this.http.get(this.baseUrl +'properties/inprogress').subscribe((data) => {
        this.workorder_selected = data as object[];
      });
      this.loading = false;
    });
  }

  inprogress(_address: String, _time:String,){
    this.loading = true;
    this.compl_obj = {
      address : _address,
      time: _time
    }
    this.http
    .post(
      this.baseUrl +
        "properties/workorder/inprogress", this.compl_obj)
    .subscribe((data) => {
      this.http.get(this.baseUrl +'properties/inprogress').subscribe((data) => {
        this.workorder_selected = data as object[];
      });
      this.loading = false;
    });
  }
  getSubmitDate(workorder: object[], index: number){
    if(workorder.length>0){
      return workorder[index]['submitdate']
    }else{
      return "NA";
    }
  }
  getStatus(workorder: object[], index: number){
    if(workorder.length>0){
      return workorder[index]['status']
    }else{
      return "NA";
    }
  }
}
