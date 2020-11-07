import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CoronaserviceService } from '../coronaservice.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {

  username: string;
  constructor(private http: HttpClient, private ds: CoronaserviceService) { }

  ngOnInit() {
    this.ds.current.subscribe(message => this.username = message);
  }

}
