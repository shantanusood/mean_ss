
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoronaserviceService } from 'services/coronaservice.service';
@Component({
  selector: 'app-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.css']
})
export class LeftComponent implements OnInit {

  constructor(private ruuter: Router, private serv: CoronaserviceService) {}

  value: String = '';
  us_e = false;
  us_s = false;
  world_e = false;
  world_s = false;
  us_e_count: number = 0;
  us_s_count: number = 0;
  world_e_count: number = 0;
  world_s_count: number = 0;

  change(val:string){
    this.serv.changeMessage(val);
  }

  setUSEcon() {
    this.us_e_count = this.us_e_count + 1;
    if (this.us_e_count % 2 === 0 || this.us_e_count === 0) {
      this.us_e = false;
    } else {
      this.us_e = true;
    }
  }

  setUSSoc() {
    this.us_s_count = this.us_s_count + 1;
    if (this.us_s_count % 2 === 0 || this.us_s_count === 0) {
      this.us_s = false;
    } else {
      this.us_s = true;
    }
  }

  setWorldEcon() {
    this.world_e_count = this.world_e_count + 1;
    if (this.world_e_count % 2 === 0 || this.world_e_count === 0) {
      this.world_e = false;
    } else {
      this.world_e = true;
    }
  }

  setWorldSoc() {
    this.world_s_count = this.world_s_count + 1;
    if (this.world_s_count % 2 === 0 || this.world_s_count === 0) {
      this.world_s = false;
    } else {
      this.world_s = true;
    }
  }
  ngOnInit() {}
}
