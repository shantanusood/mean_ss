import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leftpan',
  templateUrl: './leftpan.component.html',
  styleUrls: ['./leftpan.component.css']
})
export class LeftpanComponent implements OnInit {

  constructor(private ruuter: Router) { }

  home = false;
  chome:number = 0;
  ext = false;
  cext:number = 0;
  strat = false;
  cstrat:number = 0;
  predict = false;
  cpredict:number = 0;

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
        this.ext = true;
      }else{
        this.ext = false;
      }
    }else if(type==='strat'){
      this.cstrat = this.cstrat + 1;
      if(this.cstrat%2===0 || this.cstrat===0){
        this.strat = true;
      }else{
        this.strat = false;
      }
    }else if(type==='predict'){
      this.cpredict = this.cpredict + 1;
      if(this.cpredict%2===0 || this.cpredict===0){
        this.predict = true;
      }else{
        this.predict = false;
      }
    }
  }

  ngOnInit() {
    if(this.ruuter.url.includes('home')){
      this.home = true;
    }else if(this.ruuter.url.includes('ext')){
      this.ext = true;
    }else if(this.ruuter.url.includes('strat')){
      this.strat = true;
    }else if(this.ruuter.url.includes('predict')){
      this.predict = true;
    }
  }

}
