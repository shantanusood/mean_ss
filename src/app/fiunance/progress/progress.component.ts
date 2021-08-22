import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart } from 'chart.js';
import { CoronaserviceService } from './../../coronaservice.service';
import { AppSettings } from 'src/app/AppSettings';
import {formatDate} from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  data: object;
}

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
  username: string;
  roles: string;
  role_list: object[];
  user_diffdays: any;
  closedTrd: object[];
  readonly baseUrl = AppSettings.baseUrl;
  readonly newBaseUrl = AppSettings.newbaseUrl;
  recentdaily:String[];
  add = false;
  addtext:string = "+";

  data: object[];
  chart:Chart = [];
  frontMonth:Chart = [];
  nextMonth:Chart = [];
  monthly:Chart = [];
  loading = false;
  count:number = 0;
  dataof: object[];
  datamonthly:object[];
  index: number = 5;
  type: string = "total";
  perc_change: string = " ";
  monthone: string;
  monthtwo: string;

  account_1: string;
  account_2: string;
  account_3: string;

  networth: any;
  switch_networth: boolean = true;
  add_networth: string = "add new";
  check_date: boolean = true;

  type_key: string;

  gains: object[];

  current: object[];

  curr_date= formatDate(new Date(), 'MM/dd/yyyy', 'en');

  clickedAdd: boolean = false;

  accGroups: object;
  accGroups_display_grp: string[];
  accGroups_display_acc: object[];

  colors: object = {};

  changeColor(){
    for(let x in this.colors){
      try{
        var ids = document.querySelectorAll('*[id="'+ x +'"]');
        for(let i=0; i<ids.length; i++){
          (ids[i] as HTMLSpanElement).style.color = this.colors[x];
        }
        //document.getElementsById(x).style.color = this.colors[x]
      }catch{

      }
    }
  }

  onClickAdd() {
    this.count = this.count + 1;
    if(this.count%2===0 || this.count===0){
      this.add = false;
      this.addtext = "+";
    }else{
      this.add = true;
      this.addtext = "-";
    }
}
  constructor(private http: HttpClient, private ds: CoronaserviceService, public dialog: MatDialog) {

  }

  ngAfterViewChecked(){
    this.changeColor()

  }

  ngOnInit() {

    this.type_key = this.type;
    this.ds.current.subscribe(message => this.username = message);
    this.accGroups_display_grp = [];
    this.accGroups_display_acc = [];
    this.http.get(this.baseUrl + "data/" + this.username + "/accounts/groups/get").subscribe((datax) => {
      this.accGroups = datax[0]['groups'];
      for(let x in this.accGroups){
        this.accGroups_display_grp.push(x);
        var accounts = [];
        for(let y=0;y<=Number(this.accGroups[x].length)-1;y++){
          accounts.push([this.accGroups[x][y]['name'], this.accGroups[x][y]['color']]);
        }
        this.accGroups_display_acc.push(accounts);
      }
    });

    this.http.get(this.baseUrl+"data/"+this.username+"/accounts/colors").subscribe((data) =>{
      this.colors = data;
      this.changeColor()
    })
    this.http
      .get(
        this.baseUrl +
          "data/"+this.username+"/networth/get")
      .subscribe((data) => {
        this.networth = data as object[];
      });

    this.http
      .get(
        this.baseUrl +
          "data/"+this.username+"/accounts")
      .subscribe((data) => {
        this.account_1 = data['fidelity'];
        this.account_2 = data['robinhood'];
        this.account_3 = data['tastyworks'];
      });
    this.gainsProgress();
    this.charting();
    this.gainsProgressMonthly();
    this.http.get(this.baseUrl+'data/roles/get').subscribe((data) => {
      this.role_list = data as object[];
      this.role_list.forEach(d => {
        if(d['userid']===this.username){
          this.roles = d['role'];
          var date1 = new Date(d['join']);
          var date2 = new Date();
          var diff = Math.abs(date1.getTime() - date2.getTime());
          this.user_diffdays = 14 - Math.ceil(diff / (1000 * 3600 * 24));
          if(this.user_diffdays<0){
            this.user_diffdays = "ENDED";
          }else{
            this.user_diffdays = String(this.user_diffdays) + " days";
          }
        }
      });
    });
    this.http.get(this.baseUrl+'data/'+this.username+'/daily/get').subscribe((data) => {
      this.recentdaily = data as string[];
    });
  }
  byAccount: boolean = false;
  byGroup: boolean = false;
  byNone: boolean = false;
  viewBySelect(value: String){
    if(value=='Account'){
      this.byNone = false;
      this.byAccount = true;
      this.byGroup = false;
    }else if(value=='Account Group'){
      this.byNone = false;
      this.byAccount = false;
      this.byGroup = true;
    }else{
      this.byNone = true;
      this.byAccount = false;
      this.byGroup = false;
    }
  }

  dialogBox(type: String, incoming: object){
    const dialogRef = this.dialog.open(Dialog_progress, {
      width: '450px',
      data: {_type: type, _data: incoming, _username: this.username, _baseUrl: this.baseUrl, _newBaseUrl: this.newBaseUrl }
    });
    dialogRef.disableClose = true;
  dialogRef.afterClosed().subscribe(result => {
    if(type == 'Edit Group'){
      this.accGroups_display_grp = [];
      this.accGroups_display_acc = [];

      this.accGroups = result;
        for(let x in this.accGroups){
          this.accGroups_display_grp.push(x);
          var accounts = [];
          for(let y=0;y<=Number(this.accGroups[x].length)-1;y++){
            accounts.push([this.accGroups[x][y]['name'], this.accGroups[x][y]['color']]);
          }
          this.accGroups_display_acc.push(accounts);
        }
      }
    });
  }

  formatTheDate(x){
    return formatDate(new Date(x), 'yyyy-MM-dd', 'en');

  }

  count_values: number = 0;
  addAccount(event, value: string){
    this.count_values = this.count_values + 1;
    var d = document.getElementById(value).getElementsByTagName('tbody')[0];
    var newRoww = d.insertRow(0);
    var newCell1 = newRoww.insertCell()
    newCell1.setAttribute('style', 'border: none;');
    var newCell2 = newRoww.insertCell()
    newCell2.setAttribute('style', 'border: none;');
    var newText1 = document.createElement('input');
    newText1.setAttribute('type', 'text');
    newText1.setAttribute('id', value+'name_'+this.count_values);
    var newText3 = document.createElement('input');
    newText3.setAttribute('type', 'number');
    newText3.setAttribute('id', value+'value_'+this.count_values);
    newCell1.appendChild(newText1);
    newCell2.appendChild(newText3);
  }
  inputval: number;
  changeInputVal(event){
    this.inputval = Number((event.target as HTMLInputElement).value);
  }
  updateNetWorth(isdebt: string, type: string){
    var table = document.getElementById(type);
    var tbodies = table.getElementsByTagName("tbody")[0].rows;
    var row_len = Number(tbodies.length) -1;
    console.log(this.inputval);
    for(var i=0;i<row_len;i++){
      var type_name = (tbodies[i].cells[0].firstChild as HTMLInputElement).value;
      if(type_name == undefined){
        type_name = tbodies[i].cells[0].firstChild.nodeValue;
      }
      if(type_name.length>1){
        this.networth[0][isdebt][type][type_name] = Number(this.inputval);

      }
    }

    this.networth[0]['net'] = this.net(this.networth[0]);
    delete this.networth[0]['isActive'];

    this.http
      .post(
        this.baseUrl +
          "data/"+this.username+"/networth/update", this.networth[0])
      .subscribe((data) => {
        this.networth = data as object[];
      });
  }
  onClickAddNewData(){
    this.clickedAdd = true;
  }
  onClickCloseAddNewData(){
    this.clickedAdd = false;
  }
  clickedEdit: boolean = false;
  onClickEditData(){
    this.clickedEdit = true;
  }
  onClickCloseEditData(){
    this.clickedEdit = false;
  }

  switch(){
    if(this.switch_networth==true){
      this.add_networth = "update";
      if(this.networth[0]['date']==formatDate(new Date(), 'MM/dd/yyyy', 'en')){
        this.check_date = false;
      }else{
        this.check_date = true;
      }
      this.switch_networth = false;
    }else{
      this.add_networth = "add new";
      this.switch_networth = true;
    }

  }

  changeType(type: string){
    Chart.helpers.each(Chart.instances, function (instance) {
      if (instance.chart.canvas.id === "canvas") {
        instance.destroy();
        return;
      }
    });
    if (type === 'fidelity'){
      this.index = 1;
      this.type = type;
      this.type_key = this.account_1;
    }else if (type === 'robinhood'){
      this.index = 2;
      this.type = type;
      this.type_key = this.account_2;
    }else if (type === 'tastyworks'){
      this.index = 3;
      this.type = type;
      this.type_key = this.account_3;
    }else if (type === 'retirement'){
      this.index = 4;
      this.type = type;
      this.type_key = 'retirement';
    }else if (type === 'total'){
      this.index = 5;
      this.type = type;
      this.type_key = 'total';
    }
    this.charting();
  }

  toggleAccordian(event, index) {
    var element = event.target;
    element.classList.toggle("active");
    if(this.networth[index].isActive) {
      this.networth[index].isActive = false;
    } else {
      this.networth[index].isActive = true;
    }
    var panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }
  getValuesFromJson(data: object){
    var ret = [];
    for(var x in data){
      var vals = [x, data[x]];
      ret.push(vals);
    }
    return ret;
  }
  total(data: object){
    var ret = 0;
    for(var x in data){
      ret = ret + data[x];

    }
    return ret;
  }
  net(data: object){
    var credit = 0;
    var debt = 0;
    for(var x in data['pos']){
      for(var y in data['pos'][x]){
        credit = credit + data['pos'][x][y];
      }
    }
    for(var x in data['neg']){
      for(var y in data['neg'][x]){
        debt = debt + data['neg'][x][y];
      }

    }
    return (credit - debt);
  }
  gainsProgressMonthly(){
    Chart.helpers.each(Chart.instances, function (instance) {
      if (instance.chart.canvas.id === "canvas_monthly") {
        instance.destroy();
        return;
      }
    });
    this.http
      .get(
        this.baseUrl +
        "data/"+this.username+"/gains/monthly")
      .subscribe((data2) => {
        this.datamonthly = data2 as object[];
        this.monthly = new Chart("canvas_monthly", {
          type: "bar",
          data: {
            labels: this.datamonthly[0],
            datasets: [
              {
                data: this.datamonthly[1],
                fill: false,
                borderColor: "wheat",
                backgroundColor: "wheat",
                pointHoverBackgroundColor: "wheat",
                pointHoverBorderColor: "wheat"
              }
            ]
          },
          options: {
            showAllTooltips: true,
            legend: {
              display: false
            },
            plugins: {
              datalabels: {
                 display: true,
                 align: 'center',
                 anchor: 'center'
              }
           },
            scales: {
              xAxes: [{
                display: true,
                ticks: {
                  fontColor: "wheat", // this here
                },
                gridLines: {
                  color: 'black',
                  zeroLineColor: 'wheat'
                }
              }],
              yAxes: [{
                display: true,
                ticks: {
                  fontColor: "wheat",
                },
                gridLines: {
                  color: 'wheat',
                  zeroLineColor: 'wheat'
                }
              }],
            }
          }
        });
      });

  }
  gainsProgress(){

    Chart.helpers.each(Chart.instances, function (instance) {
      if (instance.chart.canvas.id === "canvas_front") {
        instance.destroy();
        return;
      }
    });
    Chart.helpers.each(Chart.instances, function (instance) {
      if (instance.chart.canvas.id === "canvas_next") {
        instance.destroy();
        return;
      }
    });
    this.http
      .get(
        this.baseUrl +
        "data/"+this.username+"/progress/gains")
      .subscribe((data2) => {
        this.dataof = data2 as object[];
        this.monthone = this.dataof[3][0];
        this.monthtwo = this.dataof[3][1];
        this.frontMonth = new Chart("canvas_front", {
          type: "bar",
          data: {
            labels: this.dataof[0],
            datasets: [
              {
                data: this.dataof[1],
                fill: false,
                borderColor: "wheat",
                backgroundColor: "wheat",
                pointHoverBackgroundColor: "wheat",
                pointHoverBorderColor: "wheat"
              }
            ]
          },
          options: {
            showAllTooltips: true,
            legend: {
              display: false
            },
            plugins: {
              datalabels: {
                 display: true,
                 align: 'center',
                 anchor: 'center'
              }
           },
            scales: {
              xAxes: [{
                display: true,
                ticks: {
                  fontColor: "wheat", // this here
                },
                gridLines: {
                  color: 'black',
                  zeroLineColor: 'wheat'
                }
              }],
              yAxes: [{
                display: true,
                ticks: {
                  fontColor: "wheat",
                },
                gridLines: {
                  color: 'wheat',
                  zeroLineColor: 'wheat'
                }
              }],
            }
          }
        });
        this.nextMonth = new Chart("canvas_next", {
          type: "bar",
          data: {
            labels: this.dataof[0],
            datasets: [
              {
                data: this.dataof[2],
                fill: false,
                borderColor: "wheat",
                backgroundColor: "wheat",
                pointHoverBackgroundColor: "wheat",
                pointHoverBorderColor: "wheat"
              }
            ]
          },
          options: {
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: true,
                ticks: {
                  fontColor: "wheat", // this here
                },
                gridLines: {
                  color: 'black',
                  zeroLineColor: 'wheat'
                }
              }],
              yAxes: [{
                display: true,
                ticks: {
                  fontColor: "wheat",
                },
                gridLines: {
                  color: 'wheat',
                  zeroLineColor: 'wheat'
                }
              }],
            }
          }
        });
      });
  }

  currentProgress(){
    //this.loading = true;
    this.http
      .get(
        this.baseUrl +
        "data/"+this.username+"/progress/current")
      .subscribe((data) => {
        console.log(data);
        this.current = data as object[];
        //this.loading = false;
      });
  }
  addmsg:String[];
  addmsg_done:String;
  data_msg:String;
  addDataHistoric(){
    this.http
      .get(
        this.baseUrl +
        "data/"+this.username+"/daily/" +
          (document.getElementById("fidelity") as HTMLInputElement).value +
          "/" +
          (document.getElementById("robinhood") as HTMLInputElement).value +
          "/" +
          (document.getElementById("tastyworks") as HTMLInputElement).value +
          "/" +
          (document.getElementById("retirement") as HTMLInputElement).value +
          "/" +
          (document.getElementById("fidelity_c") as HTMLInputElement).value +
          "/" +
          (document.getElementById("robinhood_c") as HTMLInputElement).value +
          "/" +
          (document.getElementById("tastyworks_c") as HTMLInputElement).value +
          "/" +
          (document.getElementById("retirement_c") as HTMLInputElement).value
      )
      .subscribe((data) => {
        this.addmsg_done = data[0];

      },
      (error) => {
        if(error['status'].toString() === '404'){
          this.addmsg = ['Error: All fields are required'];
        }else{
          this.addmsg = error['status'];
        }
        this.addmsg_done = undefined;
      });
  }
  del_obj:object;
  sure_del:boolean = false;
  sure(date_:String){
    this.del_obj = {
      date: date_
    }
    this.http
      .post(
        this.baseUrl +
        "data/"+this.username+"/deletedaily", this.del_obj).subscribe((data) => {


        });
        this.sure_del = true;
  }

  retValGreater(val: string, num: string):boolean{
    if(parseFloat(val) > parseFloat(num)){
      return true ;
    }else{
      return false ;
    }

  }

  charting() {
    Chart.helpers.each(Chart.instances, function (instance) {
      if (instance.chart.canvas.id === "canvas") {
        instance.destroy();
        return;
      }
    });

    this.perc_change = "";
    this.http.get(this.baseUrl + "data/"+this.username+"/daily").subscribe(res => {
      this.data = res as object[];
      this.chart = new Chart("canvas", {
        type: "line",
        data: {
          labels: this.data[0]['date'],
          datasets: [
            {
              data: this.data[this.index][this.type],
              fill: false,
              borderColor: "wheat",
              backgroundColor: "wheat",
              pointHoverBackgroundColor: "wheat",
              pointHoverBorderColor: "wheat"
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true,
              ticks: {
                fontColor: "wheat", // this here
              },
              gridLines: {
                color: 'black',
                zeroLineColor: 'wheat'
              }
            }],
            yAxes: [{
              display: true,
              ticks: {
                fontColor: "wheat",
              },
              gridLines: {
                color: 'wheat',
                zeroLineColor: 'wheat'
              }
            }],
          }
        }
      });
    });
    this.http.get(this.baseUrl+'data/'+this.username+'/daily/get').subscribe((data) => {
      this.recentdaily = data as string[];
    });
    this.sure_del = false;
    this.addmsg_done = undefined;
  }
  updatemsg:String[];
  updatemsg_done:String;
  updatedDaily(){
    this.http
      .get(
        this.baseUrl +
        "data/"+this.username+"/updatedaily/" +
        this.formatTheDate((document.getElementById("date_y") as HTMLInputElement).value) +
          "/" +
          (document.getElementById("fidelity_y") as HTMLInputElement).value +
          "/" +
          (document.getElementById("robinhood_y") as HTMLInputElement).value +
          "/" +
          (document.getElementById("tastyworks_y") as HTMLInputElement).value +
          "/" +
          (document.getElementById("retirement_y") as HTMLInputElement).value +
          "/" +
          this.formatTheDate((document.getElementById("date_t") as HTMLInputElement).value) +
          "/" +
          (document.getElementById("fidelity_t") as HTMLInputElement).value +
          "/" +
          (document.getElementById("robinhood_t") as HTMLInputElement).value +
          "/" +
          (document.getElementById("tastyworks_t") as HTMLInputElement).value +
          "/" +
          (document.getElementById("retirement_t") as HTMLInputElement).value
      )
      .subscribe((data) => {
        console.log(data);
        this.updatemsg = undefined;
      },
      (error) => {
        if(error['status'].toString() === '404'){
          this.updatemsg = ['Error: All fields are required'];
          this.updatemsg_done = undefined;
        }else{
          this.updatemsg = [];
          this.updatemsg_done = "Success!";
        }
      });
      this.http.get(this.baseUrl+'data/'+this.username+'/daily/get').subscribe((data) => {
        this.recentdaily = data as string[];
      });
      this.loading = false;

        this.charting() ;

  }
  filterHist(filter: string){

    Chart.helpers.each(Chart.instances, function (instance) {
      if (instance.chart.canvas.id === "canvas") {
        instance.destroy();
        return;
      }
    });

    this.http.get(this.baseUrl + "data/"+this.username+"/daily/" + this.index + "/" + this.type + "/" + filter)
      .subscribe((res) => {
        this.data = res as object[];
        this.perc_change = this.data['change'];
        this.chart = new Chart("canvas", {
          type: "line",
          data: {
            labels: this.data['date'],
            datasets: [
              {
                data: this.data[this.type],
                fill: false,
                borderColor: "wheat",
                backgroundColor: "wheat",
                pointHoverBackgroundColor: "wheat",
                pointHoverBorderColor: "wheat"
              }
            ]
          },
          options: {
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: true,
                ticks: {
                  fontColor: "wheat", // this here
                },
                gridLines: {
                  color: 'black',
                  zeroLineColor: 'wheat'
                }
              }],
              yAxes: [{
                display: true,
                ticks: {
                  fontColor: "wheat",
                },
                gridLines: {
                  color: 'wheat',
                  zeroLineColor: 'wheat'
                }
              }],
            }
          }
        });
      });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.css']
})
export class Dialog_progress{

  type: string = "";
  incoming: object;
  incoming_updated: object;
  baseUrl: string;
  newBaseUrl: string;
  username: string;
  run_spinner: boolean = true;
  accGroups_display_grp: string[];
  accGroups_display_acc: object[];
  selectedOption: String;
  selectedOptionFilt: String;
  networth: object;
  networth_num : number[];
  networth_arr: object[];

  update(){
    if(this.type=='Edit Groups'){
      this.accGroups_display_grp = [];
      this.accGroups_display_acc = [];
      this.http.get(this.baseUrl + "data/" + this.username + "/accounts/groups/get").subscribe((datax) => {
        console.log(this.accGroups_display_acc)
        this.incoming_updated = datax[0]['groups'];
        for(let x in this.incoming_updated){
          this.accGroups_display_grp.push(x);
          var accounts = [];
          for(let y=0;y<=Number(this.incoming_updated[x].length)-1;y++){
            accounts.push([this.incoming_updated[x][y]['name'], this.incoming_updated[x][y]['color']]);
          }
          this.accGroups_display_acc.push(accounts);
        }
        console.log(this.accGroups_display_acc)
      });
    }
  }
  constructor(
    public dialogRef: MatDialogRef<Dialog_progress>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private http: HttpClient) {
      this.type = data['_type'];
      this.incoming = data['_data'];
      this.baseUrl = data['_baseUrl'];
      this.newBaseUrl = data['_newBaseUrl'];
      this.username = data['_username'];
      this.run_spinner = false;
      this.http
      .get(
        this.baseUrl +
          "data/"+this.username+"/accounts")
      .subscribe((data) => {
        for(var key in data){
          this.all_accounts.push(data[key])
        }
      });

      if(this.type=='Edit Groups'){
        this.accGroups_display_grp = [];
        this.accGroups_display_acc = [];
        for(let x in this.incoming){
          this.accGroups_display_grp.push(x);
          var accounts = [];
          for(let y=0;y<=Number(this.incoming[x].length)-1;y++){
            accounts.push([this.incoming[x][y]['name'], this.incoming[x][y]['color']]);
          }
          this.accGroups_display_acc.push(accounts);
        }
      }else if(this.type=='Net Worth'){
        this.http.get(this.baseUrl + "data/" + this.username + "/accounts/get").subscribe((datax) => {
          var acc_data = datax as object[];
          this.http.get(this.newBaseUrl + "progress/" + this.username + "/daily").subscribe((datax) => {
            this.networth = datax as object;
            this.networth = this.networth[Object.keys(this.networth)[0]] as object;
            this.networth_arr = []
            this.networth_num = [0, 0, 0, 0, 0]
            for(let x in this.networth){
              for(let y=0;y<=Number(acc_data.length)-1;y++){
                if(x == acc_data[y]['id']){
                  this.networth_arr.push([acc_data[y]['name'], [this.networth[x]['cash'], this.networth[x]['margin'], this.networth[x]['long'], this.networth[x]['short'], this.networth[x]['total']]]);
                  this.networth_num[0] = this.networth_num[0] + this.networth[x]['cash'];
                  this.networth_num[1] = this.networth_num[1] + this.networth[x]['margin'];
                  this.networth_num[2] = this.networth_num[2] + this.networth[x]['long'];
                  this.networth_num[3] = this.networth_num[3] + this.networth[x]['short'];
                  this.networth_num[4] = this.networth_num[4] + this.networth[x]['total'];
                }
              }
            }
          });
        });
      }
    }
    newAccclick: boolean = false;
    all_accounts = [];

    selectOption(value: String) {
      this.selectedOption = value;
     }
     selectOptionFilt(value: String) {
      this.selectedOptionFilt = value;
     }
     getAccNotGroup(group: String){
      var accounts = [];
      for(let x in this.incoming){
        if(String(x)==group){
          for(let y=0;y<=Number(this.incoming[x].length)-1;y++){
            accounts.push(this.incoming[x][y]['name']);
          }
        }
      }
      var final_acc = [];
      for(let x in this.all_accounts){
        if(accounts.includes(this.all_accounts[x])){

        }else{
          final_acc.push(this.all_accounts[x]);
        }
      }
      return final_acc;
     }
     addAccToGroup(_group: any){
       this.run_spinner = true;
      this.http.get(this.baseUrl + "data/" + this.username + "/accounts/get").subscribe((datax) => {
        var acc_data = datax as object[];
        var acc_id;
       for(let y=0;y<=Number(acc_data.length)-1;y++){
         if(this.selectedOptionFilt == acc_data[y]['name']){
           acc_id = acc_data[y]['id'];
           break;
         }
       }
      var dataToSend = {
        group: _group,
        id_list: [acc_id]
      }
      this.http.post(this.baseUrl + "data/" + this.username + "/accounts/groups/add", dataToSend).subscribe((datax) => {
        this.incoming = datax;
        this.update();
        this.run_spinner = false;
      });

    });
     }
     addAccToNewGroup(){
      this.run_spinner = true;
       var newGroup = (document.getElementById("newAccName") as HTMLInputElement).value
       this.http.get(this.baseUrl + "data/" + this.username + "/accounts/get").subscribe((datax) => {
        var acc_data = datax as object[];
        var acc_id;
       for(let y=0;y<=Number(acc_data.length)-1;y++){
         if(this.selectedOption == acc_data[y]['name']){
           acc_id = acc_data[y]['id'];
           break;
         }
       }
      var dataToSend = {
        group: newGroup,
        id_list: [acc_id]
      }
      this.http.post(this.baseUrl + "data/" + this.username + "/accounts/groups/add", dataToSend).subscribe((datax) => {
        this.incoming = datax;
        this.update();
        this.run_spinner = false;
      });

    });
     }
     delAccFromGroup(_group: any, _account: String){
      this.run_spinner = true;

      this.http.get(this.baseUrl + "data/" + this.username + "/accounts/get").subscribe((datax) => {
        var acc_data = datax as object[];
        var acc_id;
       for(let y=0;y<=Number(acc_data.length)-1;y++){
         if(_account == acc_data[y]['name']){
           acc_id = acc_data[y]['id'];
           break;
         }
       }
      var dataToSend = {
        group: _group,
        id_list: acc_id
      }
      this.http.post(this.baseUrl + "data/" + this.username + "/accounts/groups/delete", dataToSend).subscribe((datax) => {
        this.incoming = datax;
        this.update()
        this.run_spinner = false;
      });

    });
     }
     delGroup(_group: String){
      this.run_spinner = true;

      this.http.get(this.baseUrl + "data/" + this.username + "/accounts/groups/" + _group + "/delete").subscribe((datax) => {
        this.incoming = datax;
        this.update()
        this.run_spinner = false;

      });

     }
    addNewAccount(){
      this.newAccclick = true;
    }

    onSaveClick(){
      this.dialogRef.close(this.incoming);

    }

    onNoClick(): void {

    }
  }
