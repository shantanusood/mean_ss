import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AppSettings } from './AppSettings';
import { CoronaserviceService } from './coronaservice.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnInit {

  readonly baseUrl = AppSettings.baseUrl;
  username: string;
  notification_alert: number = 0;

  trade_notification: object[];

  private subject = new BehaviorSubject<number>(this.notification_alert);
  current = this.subject.asObservable();

  sendData(message: number) {

      this.subject.next(message);
  }


  public getData(): Observable<any> {
      return this.subject.asObservable();
  }

  constructor(private ds: CoronaserviceService, private http: HttpClient) {

  }

  async ngOnInit() {
    console.log("********************CALLED*********************");

    await this.ds.current.subscribe(message => this.username = message);
    await this.getNotifications();
    await this.current.subscribe(x => this.notification_alert = x);
  }
  getNotifications() {

    var counter = 0;
    this.http.get(
      this.baseUrl +
        "data/"+this.username+"/notification/get").subscribe(data => {
      this.trade_notification = data as object[];
      this.trade_notification.forEach(ele => {
        if(ele['status']=='unread'){
          counter = counter + 1;
        }
      });
      this.sendData(counter);
    });

  }

}
