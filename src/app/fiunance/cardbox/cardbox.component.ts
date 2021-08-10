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
  loading = true;
  display_data: object;
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

  refresh(){
    this.loading = true;
    this.display_data_arr = []
    this.display_data_meta = []
    this.http.post(this.newbaseUrl + "display/" + this.username + "/get", this.position).subscribe((data) => {
      this.display_data = data;
      for(var keys in this.display_data){
        this.display_data_arr.push(this.display_data[keys])
      }
      this.loading = false;
    },
    (error) => {
      this.loading = false;

    });
    this.http.post(this.newbaseUrl + "display/" + this.username + "/cache/get/meta", this.position).subscribe((data) => {
      this.display_data_meta = data as string[];
    },
    (error) => {
    });

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
}
remZero(str: string){
    if(str == "0"){
      return ""
    }
    return str
  }
  ngOnInit() {
    this.ticker = this.position['Ticker'];
    this.loading = true;

    this.http.post(this.newbaseUrl + "display/" + this.username + "/cache/get/" + this.position['Ticker'], this.position).subscribe((data) => {
      this.display_data = data;
      for(var keys in this.display_data){
        this.display_data_arr.push(this.display_data[keys])
      }
      this.loading = false;

    },
    (error) => {
      this.loading = false;

    });


    this.http.post(this.newbaseUrl + "display/" + this.username + "/cache/get/meta", this.position).subscribe((data) => {
      this.display_data_meta = data as string[];
    },
    (error) => {
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
      width: '400px',
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

  type: String = "";
  ticker: String = "";
  incoming: object;
  populate_data: object[];
  baseUrl: String;
  username: String;
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
          this.populate_data = data as object[];
          this.run_spinner = false;
        });
      }else if(this.type == 'Close Trade'){
        this.http.post(this.baseUrl + "display/" + this.username + "/trade/close/" + this.ticker, this.incoming).subscribe((datax) => {
          this.populate_data = [];
          this.populate_data = datax as object[];
          this.run_spinner = false;
        });
      }

    }
    closeTrade(){
      this.run_spinner = true;
      this.http.post(this.baseUrl + "display/" + this.username + "/trade/close/" + this.ticker +
          "/"+(document.getElementById('tradeContracts') as HTMLInputElement).value +
          "/" +  (document.getElementById('tradeClose') as HTMLInputElement).value, this.incoming).subscribe((datax) => {
        this.run_spinner = false;

      });
    }

}
