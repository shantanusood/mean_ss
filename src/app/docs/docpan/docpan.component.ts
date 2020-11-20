import { Component, OnInit } from '@angular/core';
import { CoronaserviceService } from "services/coronaservice.service";

@Component({
  selector: 'app-docpan',
  templateUrl: './docpan.component.html',
  styleUrls: ['./docpan.component.css']
})
export class DocpanComponent implements OnInit {

  roleslist: boolean = false;
  newuser: boolean = false;
  tasks: boolean = false;
  default: boolean = true;
  deleteuser:boolean= false;

  constructor( private serv: CoronaserviceService) { }
  ngAfterViewInit(): void {
    (<any>window).twttr.widgets.load();
}
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
