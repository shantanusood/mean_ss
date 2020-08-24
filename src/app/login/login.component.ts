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

  //readonly baseUrl = "http://localhost:5000/";
  readonly baseUrl = "https://shantanusood.pythonanywhere.com/";

  onClickLogin(){
    this.username = (document.getElementById("username") as HTMLInputElement).value;
    this.pin = (document.getElementById("pin") as HTMLInputElement).value;
    this.http.get('/assets/roles.json').subscribe((data) => {
      this.role_list = data as object[];
      this.role_list.forEach(d => {
        if(d['userid']===this.username){
          this.http.get(this.baseUrl + "data/"+this.username+"/getit").subscribe((data) => {
            console.log(this.pin);
            console.log(this.pin==data['this']);
            if(this.pin==data['this']){
              this.ds.sendData(this.username);
            }
          });
        }
      });
    });
    this.ds.current.subscribe(message => this.username2 = message);
    if(!this.username2){
      this.correct = true;
    }
  }
  ngOnInit() {
  }

}
