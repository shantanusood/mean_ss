import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coronaleft',
  templateUrl: './coronaleft.component.html',
  styleUrls: ['./coronaleft.component.css']
})
export class CoronaleftComponent implements OnInit {

  constructor(private ruuter: Router) { }

  home = false;
  count:number = 0;

  setHome(){
    this.count = this.count + 1;
    console.log(this.count);
    if(this.count%2===0 || this.count===0){
      this.home = false;
    }else{
      this.home = true;
    }
  }

  ngOnInit() {
  }

}
