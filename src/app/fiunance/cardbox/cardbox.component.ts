import { Inject, Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';
import { cpuUsage } from 'process';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tick } from '@angular/core/testing';

export interface DialogData {
  data: object;
}

@Component({
  selector: 'app-cardbox',
  templateUrl: './cardbox.component.html',
  styleUrls: ['./cardbox.component.css']
})
export class CardboxComponent implements OnInit {

  @Input() position: object;
  @Input() username: string;

  ticker: string;
  ticker_group: string;
  loading = true;
  display_data: object;
  groups_data: object[] = [];
  display_data_arr: object[] = [];
  display_data_meta: string[] = [];

  ngAfterViewChecked(){
    this.changeColor()

  }

  strSplit(str: string, type: string){
    if(type=="first"){
      if(str == "PRICE"){
        return ""
      }
      return str.split("_")[0];
    }else{
      try{
        return str.split("_")[1];
      }catch{
        return ""
      }
    }
  }

  checkITM(str: String, str1: String){
      if(new String(str).indexOf("Stock")!=-1){
        return "Stock"
      }else if(new String(str).indexOf("PRICE")!=-1){
        return "PRICE"
      }else{
        if(new String(str1).indexOf("-")!=-1){
          return "ITM"
        }else{
          return "OTM"
        }
    }
  }

  networth(worth: object){
    var ret_list = [];
    for(var keys in worth['NetWorth']){
      if(worth['NetWorth'][keys] != 0 && keys != "Total"){
        ret_list.push([keys, worth['NetWorth'][keys]])
      }
    }
    ret_list.sort().reverse();
    ret_list.push([keys, worth['NetWorth']["Total"]])
    return ret_list;
  }

  groups(){
    this.http.get(this.newbaseUrl + "groups/" + this.username + "/get").subscribe((data) => {
      this.groups_data = data as object[];
      for(var group in this.groups_data){
        for(var subgroup in this.groups_data[group]){
          for(var tick in this.groups_data[group][subgroup]){
            if(String(this.ticker).toUpperCase() === String(this.groups_data[group][subgroup][tick]).toUpperCase() ){
              this.ticker_group = String(group) + " .  | .  " + String(subgroup)
              break;
            }
          }
        }
      }

    },
    (error) => {
    });
  }

  refresh(){
    if(String(this.ticker)==="EARNINGS"){
      this.loading = true;
      this.display_data_arr = []
      this.display_data_meta = []
      this.http.get(this.newbaseUrl + "networth/" + this.username + "/get").subscribe((data) => {
        this.loading = false;
      },
      (error) => {
        this.loading = false;

      });
    }else{
      this.loading = true;
      this.display_data_arr = []
      this.display_data_meta = []
      this.http.post(this.newbaseUrl + "display/" + this.username + "/get", this.position).subscribe((data) => {
        this.display_data = data;
        for(var keys in this.display_data){
          this.display_data_arr.push(this.display_data[keys])
        }
        this.http.post(this.newbaseUrl + "display/" + this.username + "/get/meta", this.position).subscribe((data) => {
          this.display_data_meta = data as string[];
          this.loading = false;
        },
        (error) => {
        });
      },
      (error) => {
        this.loading = false;

      });
    }

  }

  type: string;

  selectType(value: string){
    this.type = value;
  }
  all_accounts = [];
  account: string;


  selectOption(value: string){
    this.account = value;
  }
  constructor(private http: HttpClient, public dialog: MatDialog) { }

  newbaseUrl:string = AppSettings.newbaseUrl;
  baseUrl:string = AppSettings.baseUrl;

  changeColor(){
    try{
      for(let x of this.display_data_arr){
        let val = x as String[];
        if (Array.isArray(val[0])) {
          for(let y of val){
            document.getElementById(y.toString()).style.color = y[3];
          }
        }else{
          document.getElementById(x.toString()).style.color = x[3];
        }
      }
    }catch(e){
      console.log((e as Error).message);
    }

}

remZero(str: string){
    if(str == "0"){
      return ""
    }
    return str
  }
  ngOnInit() {
    this.groups();
    this.ticker = this.position['Ticker'];
    this.loading = true;

    this.http.post(this.newbaseUrl + "display/" + this.username + "/cache/get/" + this.position['Ticker'], this.position).subscribe((data) => {
      this.display_data = data;
      for(var keys in this.display_data){
        this.display_data_arr.push(this.display_data[keys])
      }
      this.http.post(this.newbaseUrl + "display/" + this.username + "/cache/get/meta", this.position).subscribe((data) => {
        this.display_data_meta = data as string[];
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      });


    },
    (error) => {
      this.loading = false;

    });


    this.all_accounts = [];
    this.http
      .get(
        this.baseUrl +
          "data/"+this.username+"/accounts")
      .subscribe((data) => {
        for(var key in data){
          this.all_accounts.push(data[key])
        }
      });


  }

  addCashFlow(){
    this.loading = true;
    var toBeAdded = {
        ticker: this.ticker,
        account: this.account,
        datetime: new Date().toLocaleString(),
        type: this.type,
        name: (document.getElementById(this.ticker+"_name") as HTMLInputElement).value,
        amount: (document.getElementById(this.ticker+"_amount") as HTMLInputElement).value
      }
    this.http.post(this.newbaseUrl + "trade/" + this.username + "/add/cashflow", toBeAdded).subscribe((data) => {


      this.loading = false;
    },
    (error) => {

    });
  }

  deleteCashFlow(y:String[]){
    this.loading = true;
    var toBeRemoved ={
      ticker: this.ticker,
      del: y
    }

    this.http.post(this.newbaseUrl + "trade/" + this.username + "/delete/cashflow", toBeRemoved).subscribe((data) => {
      this.refresh()
    },
    (error) => {

    });

  }

  dialogBox(type: String, incoming: object){
    const dialogRef = this.dialog.open(Dialog_cardbox, {
      width: '450px',
      data: {_type: type, _ticker: this.ticker, _data: incoming, _username: this.username, _baseUrl: this.newbaseUrl}
    });
  dialogRef.afterClosed().subscribe(result => {  });
  }

}

@Pipe({
  name: 'removeWhiteSpace'
})
export class RemoveWhiteSpacePipe implements PipeTransform {

  transform(value: any): any {
    if (value === undefined)
      return 'undefined';
    return String(value).replace(/\s/g, "").replace("/", "").replace(":", "");
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.css']
})
export class Dialog_cardbox {

  type: string = "";
  ticker: string = "";
  incoming: object;
  populate_data: object[];
  populate_data_opt: object[];
  baseUrl: string;
  username: string;
  run_spinner: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<Dialog_cardbox>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private http: HttpClient) {
      this.type = data['_type'];
      this.ticker = data['_ticker'];
      this.incoming = data['_data'];
      this.baseUrl = data['_baseUrl'];
      this.username = data['_username'];

      if(this.type == 'View Trade'){
        this.http.post(this.baseUrl + "display/" + this.username + "/trade/view/" + this.ticker, this.incoming).subscribe((data) => {
          this.populate_data = [];
          this.populate_data_opt = [];
          this.populate_data = data as object[];
          if('ShortCall' in this.populate_data){
            this.populate_data_opt['ShortCall'] = this.populate_data['ShortCall'];
            delete this.populate_data['ShortCall'];
          }
          if('LongCall' in this.populate_data){
            this.populate_data_opt['LongCall'] = this.populate_data['LongCall'];
            delete this.populate_data['LongCall'];
          }
          if('ShortPut' in this.populate_data){
            this.populate_data_opt['ShortPut'] = this.populate_data['ShortPut'];
            delete this.populate_data['ShortPut'];
          }
          if('LongPut' in this.populate_data){
            this.populate_data_opt['LongPut'] = this.populate_data['LongPut'];
            delete this.populate_data['LongPut'];
          }
          this.run_spinner = false;
        });
      }else {
        this.isIron = false;
        this.showSingleLeg = false;

        this.http.post(this.baseUrl + "display/" + this.username + "/trade/close/" + this.ticker, this.incoming).subscribe((datax) => {
          this.populate_data = [];
          this.populate_data = datax as object[];
          console.log(this.populate_data);
          this.run_spinner = false;
          this.isIronFun();
        });
      }

    }
    closeTrade(){
      this.run_spinner = true;
      this.http.post(this.baseUrl + "trade/" + this.username + "/close/" + this.ticker +
          "/"+(document.getElementById('tradeContracts') as HTMLInputElement).value +
          "/" +  (document.getElementById('tradeClose') as HTMLInputElement).value, this.incoming).subscribe((datax) => {
        this.run_spinner = false;

      });
    }
    receieveDummy: string = "x"
    rollTrade(){
      var _longcall = "";
      if((document.getElementById('longcall') as HTMLInputElement) == null){
        _longcall = "0";
      }else{
        _longcall = (document.getElementById('longcall') as HTMLInputElement).value;
      }
      var _shortcall = "";
      if((document.getElementById('shortcall') as HTMLInputElement) == null){
        _shortcall = "0";
      }else{
        _shortcall = (document.getElementById('shortcall') as HTMLInputElement).value;
      }
      var _longput = "";
      if((document.getElementById('longput') as HTMLInputElement) == null){
        _longput = "0";
      }else{
        _longput = (document.getElementById('longput') as HTMLInputElement).value;
      }
      var _shortput = "";
      if((document.getElementById('shortput') as HTMLInputElement) == null){
        _shortput = "0";
      }else{
        _shortput = (document.getElementById('shortput') as HTMLInputElement).value;
      }

      var dataToAdd2:object = {
        close: this.incoming,
        open : {
          Account: this.populate_data['Account'],
          TradeDate: new Date(),
          Strategy: this.populate_data['type'],
          Longtype: "N/A",
          Ticker: this.ticker,
          Contracts: (document.getElementById('contracts') as HTMLInputElement).value,
          Collateral: (document.getElementById('collateral') as HTMLInputElement).value,
          Expiry: (document.getElementById('expiry') as HTMLInputElement).value,
          LongCall: _longcall,
          ShortCall: _shortcall,
          ShortPut: _shortput,
          LongPut: _longput,
          Premium: (document.getElementById('premium') as HTMLInputElement).value
        }
      }
      this.run_spinner = true;
      this.http.post(this.baseUrl + "trade/" + this.username + "/roll/" + this.ticker +
          "/"+(document.getElementById('tradeContracts') as HTMLInputElement).value +
          "/" +  (document.getElementById('tradeClose') as HTMLInputElement).value + "/" + this.receieveDummy, dataToAdd2).subscribe((datax) => {
        this.run_spinner = false;

      });
    }
    closeStockTrade(){
      this.run_spinner = true;
      this.http.post(this.baseUrl + "trade/" + this.username + "/stock/close/" + this.ticker +
          "/"+(document.getElementById('tradeContracts') as HTMLInputElement).value +
          "/" +  (document.getElementById('tradeClose') as HTMLInputElement).value + "/" + this.selectRecieve + "/" + this.selectLiquid, this.incoming).subscribe((datax) => {
        this.run_spinner = false;

      });
    }
    closeLegTrade(){
      this.run_spinner = true;
      var dataToAdd ={
        TradeDate: new Date(),
        _account: this.populate_data['Account'],
        _data: this.incoming
      }
      this.http.post(this.baseUrl + "trade/" + this.username + "/leg/close/" + this.ticker +
          "/"+(document.getElementById('tradeContracts') as HTMLInputElement).value +
          "/" +  (document.getElementById('tradeClose') as HTMLInputElement).value +
          "/" + this.selectRecieve, dataToAdd).subscribe((datax) => {
        this.run_spinner = false;

      });
    }

    rollLegTrade(){
      this.run_spinner = true;
      var _longcall = "";
      if((document.getElementById('longcall') as HTMLInputElement) == null){
        _longcall = "0";
      }else{
        _longcall = (document.getElementById('longcall') as HTMLInputElement).value;
      }
      var _shortcall = "";
      if((document.getElementById('shortcall') as HTMLInputElement) == null){
        _shortcall = "0";
      }else{
        _shortcall = (document.getElementById('shortcall') as HTMLInputElement).value;
      }
      var _longput = "";
      if((document.getElementById('longput') as HTMLInputElement) == null){
        _longput = "0";
      }else{
        _longput = (document.getElementById('longput') as HTMLInputElement).value;
      }
      var _shortput = "";
      if((document.getElementById('shortput') as HTMLInputElement) == null){
        _shortput = "0";
      }else{
        _shortput = (document.getElementById('shortput') as HTMLInputElement).value;
      }
      var dataToAdd ={
        close: {
          TradeDate: new Date(),
          _account: this.populate_data['Account'],
          _data: this.incoming
        },
        open : {
          Account: this.populate_data['Account'],
          TradeDate: new Date(),
          Strategy: this.populate_data['type'],
          Longtype: "N/A",
          Ticker: this.ticker,
          Contracts: (document.getElementById('contracts') as HTMLInputElement).value,
          Collateral: (document.getElementById('collateral') as HTMLInputElement).value,
          Expiry: (document.getElementById('expiry') as HTMLInputElement).value,
          LongCall: _longcall,
          ShortCall: _shortcall,
          ShortPut: _shortput,
          LongPut: _longput,
          Premium: (document.getElementById('premium') as HTMLInputElement).value
        }
      }
      this.http.post(this.baseUrl + "trade/" + this.username + "/roll/" + this.ticker +
          "/"+(document.getElementById('tradeContracts') as HTMLInputElement).value +
          "/" +  (document.getElementById('tradeClose') as HTMLInputElement).value +
          "/" + this.selectRecieve, dataToAdd).subscribe((datax) => {
        this.run_spinner = false;

      });
    }

    selectRecieve: String;
    selectRecieved(value: String) {
      this.selectRecieve = value;
     }
     selectLiquid: String;
     selectLiquidation(value: String) {
       this.selectLiquid = value;
      }

    isIron: boolean = false;
    showSingleLeg: boolean = false;
    legData: object;
    showNonIronFun(val: string){
      if(val == 'true'){
        this.isIron = false;
        this.showSingleLeg = true;

        this.run_spinner = true;
        this.http.post(this.baseUrl + "display/" + this.username + "/trade/leg/" + this.ticker, this.incoming).subscribe((datax) => {
          this.populate_data = [];
          this.populate_data = datax as object[];
          this.run_spinner = false;
        });
      }else{
        this.isIron = false;
      }
    }
    isIronFun(){
      if(this.populate_data['type'].indexOf('Iron')!=-1){
        this.isIron = true;
      }else{
        this.isIron = false;
      }
    }
    onNoClick(): void {

      this.dialogRef.close();
    }

}
