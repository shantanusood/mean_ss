import { Component, HostListener, Inject, OnInit, Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-tutoring',
  templateUrl: './tutoring.component.html',
  styleUrls: ['./tutoring.component.css']
})
export class TutoringComponent implements OnInit {

  public towns = [];
  public townSelected = "shantanusood";

  stocks = false;
  etfs = false;
  index = false;
  mutual = false;
  futures = false;
  currency = false;
  options = false;
  roles: object[];
  refreshed: number = 0;

  type:string = "";

  constructor(private http: HttpClient) {
    this.http.get('/assets/roles.json').subscribe((data) => {
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
