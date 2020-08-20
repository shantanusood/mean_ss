import { Component, OnInit } from '@angular/core';
import { CoronaserviceService} from './../coronaservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private ds: CoronaserviceService) { }

  onClickLogin(){
    this.ds.sendData((document.getElementById("username") as HTMLInputElement).value);
  }
  ngOnInit() {
  }

}
