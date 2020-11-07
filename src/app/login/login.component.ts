import { Component, OnInit } from '@angular/core';
import { CoronaserviceService} from './../coronaservice.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private ds: CoronaserviceService, private http: HttpClient) { }

  username: string;
  pin: string;
  username2: string;
  correct: boolean = false;
  role_list: object[];
  loading = false;
  test = 0;

  //readonly baseUrl = "http://localhost:5000/";
  readonly baseUrl = "https://shantanusood.pythonanywhere.com/";

  onClickLogin(){
    this.loading = true;
    this.username = (document.getElementById("username") as HTMLInputElement).value;
    this.pin = (document.getElementById("pin") as HTMLInputElement).value;
    this.http.get('/assets/roles.json').subscribe((data) => {
      this.role_list = data as object[];
      this.role_list.forEach(d => {
        if(d['userid']===this.username){
          this.http.get(this.baseUrl + "data/"+this.username+"/getit").subscribe((data) => {
            if(this.pin==data['this']){
              this.ds.sendData(this.username);
            }else{
              this.correct = true;
            }
            this.loading = false;
          });
        }
      });
    });

  }
  ngOnInit() {
  }

}
