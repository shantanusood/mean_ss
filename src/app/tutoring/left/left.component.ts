
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CoronaserviceService } from 'services/coronaservice.service';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/AppSettings';
@Component({
  selector: 'app-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.css']
})
export class LeftComponent implements OnInit {
  dt: object[];

  constructor(private ruuter: Router, private serv: CoronaserviceService, private http: HttpClient) {}

  value: String = '';
  readonly baseUrl = AppSettings.baseUrl;


  @Input()
  nameSel: string;
  @Input()
  refreshed: string;

  change(val:string){
    this.serv.changeMessage(val);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.refreshed){
      this.http.get(this.baseUrl + "data/"+this.nameSel+"/monitoring/raw").subscribe((data) => {
        this.dt = data as object[];
      });
    }
  }

  ngOnInit() {
  }
}
