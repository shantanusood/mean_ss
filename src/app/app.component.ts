import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Course{
  about: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'silpaservices';
  courses$: [];

  constructor(private http:HttpClient){}

  ngOnInit(): void {

  }
}
