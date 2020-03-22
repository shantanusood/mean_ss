import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-leftpan',
  templateUrl: './leftpan.component.html',
  styleUrls: ['./leftpan.component.css']
})
export class LeftpanComponent implements OnInit {

  constructor(private ruuter: Router) { }

  home = false;
  ext = false;
  strat = false;
  predict = false;

  setType(){

  }

  ngOnInit() {
    if(this.ruuter.url.includes('home')){
      this.home = true;
      this.ext = false;
      this.strat = false;
      this.predict = false;
    }else if(this.ruuter.url.includes('ext')){
      this.home = false;
      this.ext = true;
      this.strat = false;
      this.predict = false;
    }else if(this.ruuter.url.includes('strat')){
      this.home = false;
      this.ext = false;
      this.strat = true;
      this.predict = false;
    }else if(this.ruuter.url.includes('predict')){
      this.home = false;
      this.ext = false;
      this.strat = false;
      this.predict = true;
    }
  }

}
