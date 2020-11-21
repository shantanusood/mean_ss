import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoronaserviceService } from 'services/coronaservice.service';

@Component({
  selector: 'app-coronaleft',
  templateUrl: './coronaleft.component.html',
  styleUrls: ['./coronaleft.component.css']
})
export class CoronaleftComponent implements OnInit {
  constructor(private ruuter: Router, private serv: CoronaserviceService) {}

  home = true;
  chome:number = 1;
  ext = false;
  cext:number = 0;
  strat = false;
  cstrat:number = 1;

  change(val:string){
    this.serv.changeMessage(val);
  }

  open(type:String){
    if(type==='home'){
      this.chome = this.chome + 1;
      if(this.chome%2===0 || this.chome===0){
        this.home = true;
      }else{
        this.home = false;
      }
    }else if(type==='ext'){
      this.cext = this.cext + 1;
      if(this.cext%2===0 || this.cext===0){
        this.ext = false;
      }else{
        this.ext = true;
      }
    }else if(type==='strat'){
      this.cstrat = this.cstrat + 1;
      if(this.cstrat%2===0 || this.cstrat===0){
        this.strat = true;
      }else{
        this.strat = false;
      }
    }
  }

  ngOnInit() {}
}
