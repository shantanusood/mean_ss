import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { CoronaserviceService } from './coronaservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CoronaserviceService]
})
export class AppComponent implements OnInit {
  title = 'silpaservices';
  dataPassed: any;
  subscription: Subscription;

  constructor(private ds: CoronaserviceService) {
    this.subscription = this.ds.getData().subscribe(x => {
      this.dataPassed = x;
    });
  }

  ngOnInit(){
    console.log(this.dataPassed);
  }
}
