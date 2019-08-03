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
    this.http.get<Course[]>('http://localhost:1337/192.168.1.157:5000/test').subscribe(res => console.log(res));
  }
}
