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

  highbug:boolean = false;
  medbug:boolean = false;
  lowbug: boolean = false;

  openStyle: boolean = false;
  openfeat: boolean = false;

  constructor(private http: HttpClient, private serv: CoronaserviceService) {}

  chart = [];


  ngOnInit() {
    this.serv.currentMessage.subscribe(message => {
        if(message==='Vol'){
          this.roleslist = true;
          this.newuser = false;
          this.default = false;
          this.highbug = false;
          this.medbug = false;
          this.lowbug = false;
          this.openStyle = false;
          this.openfeat = false;
        }else if(message==='Chart'){
          this.newuser = true;
          this.roleslist = false;
          this.default = false;
          this.highbug = false;
          this.medbug = false;
          this.lowbug = false;
          this.openStyle = false;
          this.openfeat = false;
        }else if(message==='high'){
          this.newuser = false;
          this.roleslist = false;
          this.default = false;
          this.highbug = true;
          this.medbug = false;
          this.lowbug = false;
          this.openStyle = false;
          this.openfeat = false;
        }else if(message==='medium'){
          this.newuser = false;
          this.roleslist = false;
          this.default = false;
          this.highbug = false;
          this.medbug = true;
          this.lowbug = false;
          this.openStyle = false;
          this.openfeat = false;
        }else if(message==='low'){
          this.newuser = false;
          this.roleslist = false;
          this.default = false;
          this.highbug = false;
          this.medbug = false;
          this.lowbug = true;
          this.openStyle = false;
          this.openfeat = false;
        }else if(message==='style'){
          this.newuser = false;
          this.roleslist = false;
          this.default = false;
          this.highbug = false;
          this.medbug = false;
          this.lowbug = false;
          this.openStyle = true;
          this.openfeat = false;
        }else if(message==='func'){
          this.newuser = false;
          this.roleslist = false;
          this.default = false;
          this.highbug = false;
          this.medbug = false;
          this.lowbug = false;
          this.openStyle = false;
          this.openfeat = true;
        }
    });
  }

}
