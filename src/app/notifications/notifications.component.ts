import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../AppSettings';
import { CoronaserviceService } from '../coronaservice.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  readonly baseUrl = AppSettings.baseUrl;
  username: string;
  trade_notification: object[];
  constructor(private http: HttpClient, private ds: CoronaserviceService) { }

  ngOnInit() {

    this.ds.current.subscribe(message => this.username = message);
    this.http
      .get(
        this.baseUrl +
          "data/"+this.username+"/notification/get").subscribe(ele => {
            this.trade_notification = ele as object[];
          });
  }

}
