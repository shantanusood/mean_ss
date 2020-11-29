import { Component, OnInit } from '@angular/core';
import { CoronaserviceService } from "services/coronaservice.service";

@Component({
  selector: 'app-docpan',
  templateUrl: './docpan.component.html',
  styleUrls: ['./docpan.component.css']
})
export class DocpanComponent implements OnInit {

  count = 1;
  roleslist: boolean = false;
  newuser: boolean = false;
  tasks: boolean = false;
  default: boolean = true;
  deleteuser:boolean= false;

  inc(){
    this.count = this.count + 1;
  }
  dec(){
    this.count = this.count - 1;
  }
  jump(val: Number){
    this.count = Number(val);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  constructor( private serv: CoronaserviceService) { }

  ngOnInit() {
    this.serv.currentMessage.subscribe(message => {
      if(message==='Vol'){
        this.roleslist = true;
        this.newuser = false;
        this.tasks = false;
        this.default = false;
        this.deleteuser = false;
      }else if(message==='Chart'){
        this.newuser = true;
        this.roleslist = false;
        this.tasks = false;
        this.default = false;
        this.deleteuser = false;
      }else if(message==='Del'){
        this.newuser = false;
        this.roleslist = false;
        this.tasks = false;
        this.default = false;
        this.deleteuser = true;
      }else if(message==='Tasks'){
        this.newuser = false;
        this.deleteuser = false;
        this.roleslist = false;
        this.tasks = true;
        this.default = false;
      }
    });
  }

}
