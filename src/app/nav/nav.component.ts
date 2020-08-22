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

  countx: number = 0;
  open: boolean = false;
  msg: string;

  roles: string;

  role_list: object[];

  @Input() username: string;

  ngOnInit() {
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
  }

  openUserMenu(){
    this.countx++;
    if(this.countx%2==0){
      this.open = false;
    }else{
      this.open = true;
    }

  }

}
