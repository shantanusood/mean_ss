import { Component, HostListener, Inject, OnInit, Pipe, PipeTransform } from '@angular/core';
import { saveAs } from "file-saver";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CoronaserviceService } from './../coronaservice.service';
import { AppSettings } from './../AppSettings';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-corona',
  templateUrl: './corona.component.html',
  styleUrls: ['./corona.component.css']
})
export class CoronaComponent implements OnInit{

  loading = false;
  public towns = [];
  public townSelected;
  properties;
  property: object ={
    address : '',
    image : '',
    desc: '',
    circuitbreaker: '',
    watermain: '',
    alarm: '',
    fire: '',
    centralheat: '',
    heatage: '',
    pet: '',
    police: '',
    hospital: '',
    dmv: ''
  };
  myproperty: object;
  data: object;
  obj = {};
  message:boolean=false;

  username: string;
  roles: string;
  role_list: object[];
  requested:boolean = false;
  hasRequested:boolean;

  type:string = "";
  readonly baseUrl = AppSettings.baseUrl;

  constructor(private http: HttpClient, private ds: CoronaserviceService) {
    this.ds.current.subscribe(message => this.username = message);
    this.http.get(this.baseUrl+'data/roles/get').subscribe((data) => {
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
      desc : (document.getElementById("desc") as HTMLInputElement).value,
      circuitbreaker: (document.getElementById("circuitbreaker") as HTMLInputElement).value,
      watermain: (document.getElementById("watermain") as HTMLInputElement).value,
      alarm: (document.getElementById("alarm") as HTMLInputElement).value,
      fire: (document.getElementById("fire") as HTMLInputElement).value,
      centralheat: (document.getElementById("centralheat") as HTMLInputElement).value,
      heatage: (document.getElementById("heatage") as HTMLInputElement).value,
      pet: (document.getElementById("pet") as HTMLInputElement).value,
      police: (document.getElementById("police") as HTMLInputElement).value,
      hospital: (document.getElementById("hospital") as HTMLInputElement).value,
      dmv: (document.getElementById("dmv") as HTMLInputElement).value
    }
    console.log(this.property);
    this.http.post(this.baseUrl +'properties/'+this.townSelected+'/update', this.property).subscribe((data) => {
      console.log(data);
    });
  }
  getStatus(data: any){
    return data['status']
  }
  getExpiry(data: any){
    return data['expiry']
  }
  getDurations(data: any){
    return data['durations'];
  }
  extention(){
    this.requested = true;
  }
  getExtention(duration: String){
    this.loading = true;
    this.http
      .get(
        this.baseUrl +
          "data/"+this.username+"/rental/extend/"+duration)
      .subscribe((data) => {
        this.data = data;
        if(this.data['request']=="false"){
          this.hasRequested = true;
        }else{
          this.hasRequested = false;
        }
        this.loading = false;
      });
  }
  download() {
    this.downloadReport().subscribe(
      (data) => {
        saveAs(data, this.username+'lease.pdf');
      },
      err => {
        alert("Problem while downloading the file.");
        console.error(err);
      }
    );
  }
  downloadReport(): Observable<any>{
		return this.http.get('./assets/'+this.username+'lease.pdf', { responseType: "blob" });
   }
  ngOnInit() {
    this.ds.current.subscribe(message => this.username = message);
    this.getMyProperty();
    this.http.get(this.baseUrl +'properties/get', this.obj).subscribe((data) => {
      this.properties = data as object[];
      this.properties.forEach(d => {
          this.towns.push(d);
      });
    });

    this.http
      .get(
        this.baseUrl +
          "data/"+this.username+"/rental/history")
      .subscribe((data) => {
        this.data = data;
        if(this.data['request']=="false"){
          this.hasRequested = true;
        }else{
          this.hasRequested = false;
        }
      });
  }
}

@Pipe({ name: 'contains' })
export class AutocompletePipeCorona implements PipeTransform {
  public transform(collection: any[], term = '') {
      return collection.filter((item) => item.toString().toLowerCase().includes(term.toString().toLowerCase()));
  }
}
