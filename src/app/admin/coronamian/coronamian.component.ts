import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Chart } from "chart.js";
import { CoronaserviceService } from "services/coronaservice.service";

@Component({
  selector: "app-coronamian",
  templateUrl: "./coronamian.component.html",
  styleUrls: ["./coronamian.component.css"]
})
export class CoronamianComponent implements OnInit {

  val:String = "";
  roleslist: boolean = false;
  newuser: boolean = false;
  default: boolean = true;

  constructor(private http: HttpClient, private serv: CoronaserviceService) {}

  chart = [];


  ngOnInit() {
    this.serv.currentMessage.subscribe(message => {
        if(message==='Vol'){
          this.roleslist = true;
          this.newuser = false;
          this.default = false;
        }else if(message==='Chart'){
          this.newuser = true;
          this.roleslist = false;
          this.default = false;
        }
    });
  }

}
