import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSettings } from '../AppSettings';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private http: HttpClient) { }

  readonly baseUrl = AppSettings.baseUrl;


  countx: number = 0;
  open: boolean = false;
  msg: string;
  msg2: string;

  roles: string;

  role_list: object[];

  account_1: string;
  account_2: string;
  account_3: string;
  data: object;
  email: String;
  phone:String;

  @Input() username: string;

  update(){
    this.http
      .get(
        this.baseUrl +
          "data/"+this.username+"/"
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

  ngOnInit() {
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
    this.http.get('/assets/roles.json').subscribe((data) => {
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
      this.open = false;
    }else{
      this.open = true;
    }

  }

}
