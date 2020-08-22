import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private http: HttpClient) { }

  //readonly baseUrl = "http://localhost:5000/";
  readonly baseUrl = "http://shantanusood.pythonanywhere.com/";

  count: number = 0;
  open: boolean = false;
  msg: string;

  @Input() username: string;

  ngOnInit() {

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
  }

  openUserMenu(){
    this.count++;
    if(this.count%2==0){
      this.open = false;
    }else{
      this.open = true;
    }

  }

}
