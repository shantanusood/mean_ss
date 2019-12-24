import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['id', 'bookName', 'authorName'];
  response: any;
  constructor(private http: HttpClient) {  }
  ngOnInit() {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let obs = this.http.get('http://localhost:3200/api/testService', options);
    try{
      obs.subscribe((response) =>{
        this.response = response;
        console.log(response);
      });
    } catch(e) {
      console.log(e);
    }

  }

}
