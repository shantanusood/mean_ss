import { Component, HostListener, Inject, OnInit, Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CoronaserviceService } from './../coronaservice.service';

@Component({
  selector: 'app-corona',
  templateUrl: './corona.component.html',
  styleUrls: ['./corona.component.css']
})
export class CoronaComponent implements OnInit{

  public towns = [];
  public townSelected;
  properties;
  property: object ={
    address : '',
    image : '',
    desc: ''
  };
  myproperty: object;

  obj = {};
  message:boolean=false;

  username: string;
  roles: string;
  role_list: object[];

  type:string = "";
  //readonly baseUrl = "http://localhost:5000/";
  readonly baseUrl = "https://shantanusood.pythonanywhere.com/";

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
      this.towns = [];
  }
  addNewProperty(){
    this.obj = {
      name: (document.getElementById("propname") as HTMLInputElement).value,
      address: (document.getElementById("propaddress") as HTMLInputElement).value
    }
    this.http.post(this.baseUrl +'properties/add', this.obj).subscribe((data) => {
      this.message = true;
    });
  }

  getProperty(){
    this.http.get(this.baseUrl +'properties/'+this.townSelected+'/get').subscribe((data) => {
      this.property = data;
    });
  }

  getMyProperty(){
    this.http.get(this.baseUrl +'data/'+this.username+'/rental/history').subscribe((data) => {
      console.log(data);
      this.myproperty = data as object;
      console.log(this.myproperty);
      this.http.get(this.baseUrl +'properties/'+this.myproperty['propetyname']+'/get').subscribe((data) => {
        this.property = data;
      });
    });
  }

  updateProperty(){
    this.property = {
      address : (document.getElementById("address") as HTMLInputElement).value,
      image : (document.getElementById("image") as HTMLInputElement).value,
      desc : (document.getElementById("desc") as HTMLInputElement).value
    }
    console.log(this.property);
    this.http.post(this.baseUrl +'properties/'+this.townSelected+'/update', this.property).subscribe((data) => {
      console.log(data);
    });
  }

  ngOnInit() {
    this.getMyProperty();
    this.http.get(this.baseUrl +'properties/get', this.obj).subscribe((data) => {
      this.properties = data as object[];
      this.properties.forEach(d => {
          this.towns.push(d);
      });
    });
  }
}

@Pipe({ name: 'contains' })
export class AutocompletePipeCorona implements PipeTransform {
  public transform(collection: any[], term = '') {
      return collection.filter((item) => item.toString().toLowerCase().includes(term.toString().toLowerCase()));
  }
}
