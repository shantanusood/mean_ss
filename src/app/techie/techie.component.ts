import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CoronaserviceService } from '../coronaservice.service';

@Component({
  selector: 'app-techie',
  templateUrl: './techie.component.html',
  styleUrls: ['./techie.component.css']
})
export class TechieComponent implements OnInit {

  username: string;
  roles: string;
  role_list: object[];

  type:string = "";

  constructor(private http: HttpClient, private ds: CoronaserviceService) {
    this.ds.current.subscribe(message => this.username = message);
    this.http.get('/assets/roles.json').subscribe((data) => {
      this.role_list = data as object[];
      this.role_list.forEach(d => {
        if(d['userid']===this.username){
          this.roles = d['role'];
        }
        console.log(d['userid']);
        console.log(d['role']);
      });
    });
  }
  ngOnInit() {
    this.ds.current.subscribe(message => this.username = message);
  }

}
