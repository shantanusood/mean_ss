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

  value: String = '';
  home = false;
  count: number = 0;

  change(val:string){
    this.serv.changeMessage(val);
  }

  setHome() {
    this.count = this.count + 1;
    if (this.count % 2 === 0 || this.count === 0) {
      this.home = false;
    } else {
      this.home = true;
    }
  }

  ngOnInit() {}
}
