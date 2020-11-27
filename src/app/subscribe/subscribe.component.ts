import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../AppSettings';
import { CoronaserviceService } from '../coronaservice.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {

  username: string;
  constructor(private http: HttpClient, private ds: CoronaserviceService) {}


   subscriber:object;
   readonly baseUrl = AppSettings.baseUrl;
   subscribeDetails(){
    this.subscriber = {
      username: this.username,
      paypal: (document.getElementById("paypal") as HTMLInputElement).value,
      datetime: new Date()
    }
    this.http.post(this.baseUrl + "data/subscriber/add", this.subscriber).subscribe((data) =>{
      console.log(data);
    });
   }

   ngOnInit() {
    this.ds.current.subscribe(message => this.username = message);

   }
}
