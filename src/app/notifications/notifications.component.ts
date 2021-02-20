import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../AppSettings';
import { CoronaserviceService } from '../coronaservice.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  readonly baseUrl = AppSettings.baseUrl;
  username: string;
  trade_notification: object[];
  constructor(private http: HttpClient, private ds: CoronaserviceService) { }
  selectedDate: String;
  ngOnInit() {

    this.ds.current.subscribe(message => this.username = message);
    this.http
      .get(
        this.baseUrl +
          "data/"+this.username+"/notification/get/ThisMonth/All").subscribe(ele => {
            this.trade_notification = ele as object[];
          });
  }
  selectDate(value: String) {
    this.selectedDate = value;
   }
   filter(){
    this.http
    .get(
      this.baseUrl +
        "data/"+this.username+"/notification/get/"+this.selectedDate+"/"
            +(document.getElementById("ticker") as HTMLInputElement).value).subscribe(ele => {
          this.trade_notification = ele as object[];
        });
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

}
