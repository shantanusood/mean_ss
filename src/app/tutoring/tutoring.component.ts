import { Component, HostListener, Inject, OnInit, Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../AppSettings';
import { CoronaserviceService } from '../coronaservice.service';

@Component({
  selector: 'app-tutoring',
  templateUrl: './tutoring.component.html',
  styleUrls: ['./tutoring.component.css']
})
export class TutoringComponent implements OnInit {

  public towns = [];
  public townSelected = "";

  readonly baseUrl = AppSettings.baseUrl;
  stocks = false;
  etfs = false;
  index = false;
  mutual = false;
  futures = false;
  currency = false;
  options = false;
  roles: object[];
  refreshed: number = 0;
  username: string;
  type:string = "";

  constructor(private http: HttpClient, private ds: CoronaserviceService) {
    this.ds.current.subscribe(message => this.username = message);
    this.townSelected = this.username;
    this.http.get(this.baseUrl+'data/roles/get').subscribe((data) => {
      this.roles = data as object[];
      this.roles.forEach(x => {
        if(x['role']=='admin' || x['role']=='basictrader' || x['role']=='advancedtrader')
          this.towns.push(x['userid']);
      })
    });

  }

  onClickRefresh(){
    this.refreshed = this.refreshed + 1;
  }
  ngOnInit() {
  }

}
@Pipe({ name: 'contains' })
export class AutocompletePipeExtData implements PipeTransform {
  public transform(collection: any[], term = '') {
      return collection.filter((item) => item.toString().toLowerCase().includes(term.toString().toLowerCase()));
  }
}
