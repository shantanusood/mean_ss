import { Component, OnInit } from '@angular/core';
import { CoronaserviceService} from './../coronaservice.service';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../AppSettings';

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

  login:boolean = true;
  signup:boolean = false;
  forgotit:boolean = false;
  pin_bool: boolean = false;
  question:String = "";
  answer:String = "";
  question_bool:boolean = false;

  readonly baseUrl = AppSettings.baseUrl;

  setLogin(){
    this.signup = false;
    this.login = true;
    this.forgotit = false;
    this.pin_bool = false;
    this.checkuseer = false;
    this.correct = false;
  }
  setSignup(){
    this.pin_bool = false;
    this.signup = true;
    this.login = false;
    this.correct = false;
    this.forgotit = false;
    this.checkuseer = false;
  }
  forgot(){
    this.checkuseer = false;
    this.pin_bool = false;
    this.signup = false;
    this.login = false;
    this.correct = false;
    this.forgotit = true;
  }
  getQuestion(){
    this.http.get(this.baseUrl+'data/roles/get').subscribe((data) => {
      this.role_list = data as object[];
      this.username = (document.getElementById("username") as HTMLInputElement).value;
      this.role_list.forEach(d => {
        if(d['userid']==this.username){
          this.question_bool = true;
          this.question = d['question'];
          return this.question;
        }else{

        }
      });
    });
  }
  signup_obj: object;
  newrole: String;
  checkuseer:boolean = false;
  userexists:string = "";
  user:string = "";
  questions:String = "";
  answers:String = "";
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
        this.pin_bool = false;
        this.forgotit = false;
          this.login = false;
          this.signup = true;
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
          this.forgotit = false;
          this.login = false;
          this.signup = false;
          this.loading = false;
        });
      }
    });

  }
  getPin(){
    this.username = (document.getElementById("username") as HTMLInputElement).value;
    this.answer = (document.getElementById("answers") as HTMLInputElement).value;
    this.http.get(this.baseUrl+'data/roles/get').subscribe((data) => {
      this.role_list = data as object[];
      this.role_list.forEach(d => {
        if(d['userid']===this.username){
          if(this.answer==d['answer']){
            this.http.get(this.baseUrl + "data/"+this.username+"/getit").subscribe((data2) => {
              this.pin = data2['this'];
              this.pin_bool = true;
              this.forgotit = false;
              this.login = false;
              this.signup = false;
            });
          }else{
            this.correct = true;
          }
        }
      });
    });
  }
  onClickLogin(){
    this.loading = true;
    this.username = (document.getElementById("username") as HTMLInputElement).value;
    this.pin = (document.getElementById("pin") as HTMLInputElement).value;
    this.http.get(this.baseUrl+'data/roles/get').subscribe((data) => {
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
