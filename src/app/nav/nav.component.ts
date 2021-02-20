import { Component, OnInit, Input, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSettings } from '../AppSettings';
import { NotificationService } from '../notification.service';
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';

@Component({
  providers: [NotificationService],
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private http: HttpClient, private nt: NotificationService) { }

  readonly baseUrl = AppSettings.baseUrl;

  notification_alert: number = 0;
  trade_notification: object[];

  countx: number = 0;
  open: boolean = false;
  countn: number = 0;
  open_notification: boolean = false;
  msg: string;
  msg2: string;
  msg3: string;

  roles: string;

  role_list: object[];

  account_1: string;
  account_2: string;
  account_3: string;
  data: object;
  email: String;
  phone:String;
  interval: any;

  question:String;
  answer:String;

  @Input() username: string;

  update(){
    this.http
      .get(
        this.baseUrl +
          "data/"+this.username+"/updatedmycontact/"
          + (document.getElementById("email") as HTMLInputElement).value
          + "/"
          + (document.getElementById("phone") as HTMLInputElement).value
          )
      .subscribe((data) => {
        this.data = data;
        this.email = data['email'];
        this.phone = data['phone'];
        this.msg2 = "Changed Successfully!";
      },
      (error) => {
        this.msg2 = error['status'] + " - " + error['statusText'];
        console.log(error);
      });

  }
  notification:object;
  status:string;
  sendNotification(value: String){

    this.notification = {
      data: this.username + " requested account " + value
    }
    this.http.post(
        this.baseUrl + "data/notifications/add", this.notification)
      .subscribe((data) => {
        console.log(data);
      });
      this.http.get(
          this.baseUrl + "data/roles/changestatus/"+this.username+"/"+value)
        .subscribe((data) => {
          this.role_list = data as object[];
          this.role_list.forEach(d => {
            if(d['userid']===this.username){
              this.roles = d['role'];
              this.question = d['question'];
              this.answer = d['answer'];
              this.status = d['status'];
            }
            console.log(d['userid']);
            console.log(d['role']);
          });
        });
  }

  setUserName(username){
    this.username = username;
  }
  async ngOnInit() {
    console.log("********************CALLED*********************");
    await this.nt.ngOnInit();
    await this.nt.current.subscribe(x => this.notification_alert = x);
    await console.log("Alert");
    await console.log(this.notification_alert);
    this.http
      .get(
        this.baseUrl +
          "data/"+this.username+"/rental/history")
      .subscribe((data) => {
        this.data = data;
        this.email = data['email'];
        this.phone = data['phone'];
      });
    this.http
      .get(
        this.baseUrl +
          "data/"+this.username+"/accounts")
      .subscribe((data) => {
        this.account_1 = data['fidelity'];
        this.account_2 = data['robinhood'];
        this.account_3 = data['tastyworks'];
      });
    this.http.get(this.baseUrl+'data/roles/get').subscribe((data) => {
      this.role_list = data as object[];
      this.role_list.forEach(d => {
        if(d['userid']===this.username){
          this.roles = d['role'];
          this.question = d['question'];
          this.answer = d['answer'];
          this.status = d['status'];
        }
        console.log(d['userid']);
        console.log(d['role']);
      });
    });

    this.http
      .get(
        this.baseUrl +
          "data/"+this.username+"/notification/get")
      .subscribe((data) => {
        this.trade_notification = data as object[];
        this.trade_notification = this.trade_notification.slice(0, 6);
      });

  }
  secretqa: object;
  secret(){
    this.secretqa = {
      question: (document.getElementById("question") as HTMLInputElement).value,
      answer: (document.getElementById("answer") as HTMLInputElement).value
    }
    this.http
    .post(this.baseUrl + "data/roles/updateqa/" + this.username, this.secretqa)
    .subscribe((data) => {
      this.role_list = data as object[];
      this.role_list.forEach(d => {
        if(d['userid']===this.username){
          this.question = d['question'];
          this.answer = d['answer'];
        }
        console.log(d['userid']);
        console.log(d['role']);
      });
      this.msg3 = "Changed Successfully!";
    },
    (error) => {
      this.msg3 = error['status'] + " - " + error['statusText'];
      console.log(error);
    });
  }

  changeAcc(){
    this.http
      .get(
        this.baseUrl +
          "data/"+this.username+"/accounts/"+
          (document.getElementById("account1") as HTMLInputElement).value +
          "/" +
          (document.getElementById("account2") as HTMLInputElement).value +
          "/" +
          (document.getElementById("account3") as HTMLInputElement).value)
      .subscribe((data) => {
        this.msg = "Changed Successfully!";
      },
      (error) => {
        this.msg = error['status'] + " - " + error['statusText'];
        console.log(error);
      });
      this.http
      .get(
        this.baseUrl +
          "data/"+this.username+"/accounts")
      .subscribe((data) => {
        this.account_1 = data['fidelity'];
        this.account_2 = data['robinhood'];
        this.account_3 = data['tastyworks'];
      });
  }

  openUserMenu(){
    this.countx++;
    if(this.countx%2==0){

    this.msg ="";
    this.msg2 ="";
    this.msg3 ="";
      this.open = false;
    }else{
      this.open = true;
    }

  }

  openNotificationMenu(){
    this.countn++;
    if(this.countn%2==0){

      this.open_notification = false;
    }else{
      this.open_notification = true;
      this.notification_alert = 0;
      var updatedData = this.http.get(this.baseUrl + "data/"+this.username+"/notification/update");

      updatedData.subscribe((data) => {
        this.trade_notification = data as object[];
        this.trade_notification = this.trade_notification.slice(0, 7);
      });
    }

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
