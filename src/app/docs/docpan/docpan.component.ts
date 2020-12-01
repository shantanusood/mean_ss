import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CoronaserviceService } from "services/coronaservice.service";
import { AppSettings } from 'src/app/AppSettings';

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
  readonly baseUrl = AppSettings.baseUrl;
  obj: object;
  page: String;
  datax: object;
  type: String;
  data: any =
    [
      {
        "parentName": "Is this a trading platform?",
        "childProperties":
          [
            { "propertyName": "No, this is a trade management tool, with the advent of free options and stock trading like on apps like Robinhood, what is lacking are the post trade and trade management tools which professional trading platforms like tastyworks and tdameritrade provide, this platform is a start to bridge the gap, and provide a simple interface to help amateur traders manage there trades." }
          ]
      },
      {
        "parentName": "I am worried about my personal data and security",
        "childProperties":
          [
            { "propertyName": "We absolutely do not store any of your data of any kind on our website, and none of your credit card or personal identifying data is stored or captured, only thing we save is an email address or a phone number which you voluntarily may provide, subscription info is handled on secondary secure apps like Paypal etc." }
          ]
      },
      {
        "parentName": "How can I get more information about options trading terms?",
        "childProperties":
          [
            { "propertyName": "It is recommended that you go through all the videos on the training section, then you should go to the external sources which are mentioned in the credits below the video and watch more of there great content, finally if you need one on one help, click on mentorship section on the left bar of this page and follow the instructions." }
          ]
      },
      {
        "parentName": "How can I open a trading account and which platforms do you recommend for options trading?",
        "childProperties":
          [
            { "propertyName": "If you have an existing brokerage account, then all you need to do is to find out how you can apply for and be approved to do options trading on it, if that is not the case then, tastyworks, tdameritrade are some good options, but be ready to be charged good amount of commision and fees per contract per trade, if you would like to avoid that then best is to use Robinhood for entering into trades and use this platform to manage your trades." }
          ]
      },
      {
        "parentName": "What is the quickest way for me to mae a lot of money doing trading?",
        "childProperties":
          [
            { "propertyName": "Unfortunately, unless you are doing purely speculative trading, there is no way to make guaranteed money in the stock market, but if you are willing to put in some work and learn, there are strategies out there which can help you make a steady return and cash. That is what this platform is all about, it is not a get rich quick scheme, but it helps you towards your goal of make a steady income by taking manageable risk." }
          ]
      }
    ]

    contact: any =
    [
      {
        "parentName": "Email",
        "childProperties":
          [
            { "propertyName": "shannewyork89@gmail.com or silpaservicesllc@gmail.com" }
          ]
      },
      {
        "parentName": "Phone/Text",
        "childProperties":
          [
            { "propertyName": "(631) 875 2358 or (347) 685 3951" }
          ]
      },
      {
        "parentName": "Twitter",
        "childProperties":
          [
            { "propertyName": "https://twitter.com/tradershan89" }
          ]
      },
      {
        "parentName": "LinkedIn",
        "childProperties":
          [
            { "propertyName": "https://www.linkedin.com/in/ssood89/" }
          ]
      }
    ]
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
  constructor( private http: HttpClient, private serv: CoronaserviceService) { }

  toggleAccordian(event, index) {
    var element = event.target;
    element.classList.toggle("active");
    if(this.data[index].isActive) {
      this.data[index].isActive = false;
    } else {
      this.data[index].isActive = true;
    }
    var panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
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
    this.http.get(this.baseUrl + "data/bug/get").subscribe((data) => {
      this.datax = data;
  });

  }
  selectPage(value: String) {
    this.page = value;
  }
  selectType(value: String) {
    this.type = value;
    console.log(this.type);
   }
   getHigh(data: object){
    return data['high']
  }
  required_page:String;
  required_type:String;
  required_desc:String;
  addClick(type: String){
    if(this.page==undefined || this.page.length==0){
      this.required_page = "*";
    }else{
      this.required_page = "";
    }
    if(this.type==undefined || this.type.length==0){
      this.required_type = "*";
    }else{
      this.required_type = "";
    }
    if((document.getElementById("description") as HTMLInputElement).value.length==0){
      this.required_desc = "*";
    }else{
      this.required_desc = "";
    }
    if(this.required_page || this.required_type || this.required_desc ){
      console.log("requirement not fulfilled");
    }else{
      this.add(type);
    }
  }
  add(type: String){
    this.obj = {
      page : this.page,
      description: (document.getElementById("description") as HTMLInputElement).value,
      type: this.type
    }
    this.http.post( this.baseUrl +
        "data/bug/add/"+type, this.obj)
    .subscribe((data) => {
      this.datax = data;

    });
  }

}
