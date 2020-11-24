import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EaseInOut } from 'igniteui-angular/lib/animations/easings';
import { AstMemoryEfficientTransformer } from '@angular/compiler';
import { CoronaserviceService } from '../coronaservice.service';
import { AppSettings } from '../AppSettings';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: "app-fiunance",
  templateUrl: "./fiunance.component.html",
  styleUrls: ["./fiunance.component.css"]
})
export class FiunanceComponent implements OnInit {

  username: string;
  constructor(private http: HttpClient, public dialog: MatDialog, private ds: CoronaserviceService) {}

  arrBirds: string[];
  selectedOption:String;
  mySubscription: any;
  addedRes: string[];
  addedResErr: string[];
  loading = true;
  dt: object;
  count:number = 0;
  readonly baseUrl = AppSettings.baseUrl;

  add = false;
  addtext:string = "+";
  retExp: string[] ;

  strategy:String;
  cur_date = new Date();
  account_1: string;
  account_2: string;
  account_3: string;
  covered:boolean = false;
  callspread:boolean = false;
  putspread:boolean = false;
  account: String;

  closeTop: boolean = false;
  sure(){
    this.closeTop = true;
  }
  no(){
    this.closeTop = false;
  }

  refresh: boolean = false;

  ngOnInit() {
    this.ds.current.subscribe(message => this.username = message);
    this.http.get(this.baseUrl + "data/"+this.username+"/expiration").subscribe((data) => {
      this.dt = data as object;
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
    this.getData();
  }

  getData() {
    this.loading = true;
    this.http.get(this.baseUrl + "data/"+this.username+"/monitoring").subscribe((data) => {
      this.arrBirds = data as string[];

      for(var k in this.arrBirds){
        this.arrBirds[k]['ordered']['call'].reverse();
        this.arrBirds[k]['ordered']['put'].reverse();
      }

      this.loading = false;
    });

  }
  selectStrat(value: String){
    if(value=='Covered Call'){
      this.covered = true;
      this.callspread = false;
      this.putspread = false;
    }else if(value=='Credit Call Spread'){
      this.callspread = true;
      this.covered = false;
      this.putspread = false
    }else if(value=='Credit Put Spread'){
      this.putspread = true;
      this.callspread = false;
      this.covered = false;
    }else{
      this.covered = false;
      this.callspread = false;
      this.putspread = false;
    }
    this.strategy = value;
  }
  selectOption(value: String) {
    this.selectedOption = value;
   }
  processTopExpiration(input: object){
    this.retExp = new Array();
    for(var key in input){
      this.retExp.push(key.toString());
      this.retExp.push(input[key].toString());
    }
    console.log(this.retExp);
    return this.retExp;
  }

  reverseIt(input: any[]){
    return input;
  }

  processKey(input: object){
    var ret: string;
    for(var key in input){
      ret = key;
    }
    return ret;
  }

  process(input: object){
    var ret: string[];
    for(var key in input){
      ret = input[key];
    }
    return ret;
  }

  onClickRefresh(){
    console.log("Clicked");
    this.getData();
    this.refresh = false;
  }
  onClickDelete(ticker: any) {
    this.http
      .get(this.baseUrl + "data/"+this.username+"/monitoring/delete/" + ticker.ticker)
      .subscribe((data) => {
        //console.log(data);
      });
      this.closeTop = false;
      this.refresh = true;
  }

  animal: string;
  name: string;
  onClickDeleteStrike(ticker: any, account: string, type: string, strike: any) {

    this.http
      .get(this.baseUrl + "data/"+this.username+"/monitoring/delete/getcontracts/" + ticker.ticker + "/" + account+ "/" + type + "/" + strike)
      .subscribe((datax) => {
        const dialogRef = this.dialog.open(Dialog, {
          width: '300px',
          data: {name: this.name, animal: this.animal, contracts: datax['contracts']}
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.animal = result['animal'];
        this.name = result['name'];
        this.http
        .get(this.baseUrl + "data/"+this.username+"/monitoring/delete/" + ticker.ticker + "/" + account+ "/" + type + "/" + strike+ "/" + this.animal+ "/" + this.name)
        .subscribe((data) => {
          this.refresh = true;
          //console.log(data);
        });
      });
    });

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
  date: string;
  changeDueDate(){
    this.date = (document.getElementById("exp") as HTMLInputElement).value;
  }
  onClickAddVals() {
    console.log(this.selectedOption);
    this.http.get(
      this.baseUrl + "data/"+this.username+"/accounts").subscribe((data) => {
        console.log(data);
        if(this.selectedOption===data['fidelity']){
          this.account = 'fidelity';
        }else if(this.selectedOption===data['robinhood']){
          this.account = 'robinhood';
        }else if(this.selectedOption===data['tastyworks']){
          this.account = 'tastyworks';
        }
      var width_num: Number = Number((document.getElementById("contracts") as HTMLInputElement).value)*Number((document.getElementById("collateral") as HTMLInputElement).value);
      var width: string = String(width_num);
      this.http
        .get(
          this.baseUrl +
          "data/"+this.username+"/monitoring/add/" +
          this.account +
            "/" +
            (document.getElementById("ticker") as HTMLInputElement).value +
            "/" +
            width +
            "/" +
            this.date +
            "/" +
            (document.getElementById("call") as HTMLInputElement).value +
            "/" +
            (document.getElementById("put") as HTMLInputElement).value +
            "/" +
            (document.getElementById("premium") as HTMLInputElement).value
        )
        .subscribe((data) => {
          this.addedRes = data as string[];
          this.addedResErr = [];
          //console.log(data);
        },
        (error) => {
          this.addedRes = []
          this.addedResErr = error["statusText"] as string[];
        });
      this.http
        .get(
          this.baseUrl +
          "data/"+this.username+"/progress/add/" +
            this.account +
            "/" +
            (document.getElementById("ticker") as HTMLInputElement).value +
            "/" +
            (document.getElementById("contracts") as HTMLInputElement).value +
            "/" +
            (document.getElementById("collateral") as HTMLInputElement).value +
            "/" +
            this.date +
            "/" +
            (document.getElementById("call") as HTMLInputElement).value +
            "/" +
            (document.getElementById("put") as HTMLInputElement).value +
            "/" +
            (document.getElementById("premium") as HTMLInputElement).value
        )
        .subscribe((data) => {
          //console.log(data);
        },
        (error) => {
          if(error['status'].toString() === '404'){
            this.addedRes = ['All fields required'];
          }else{
            this.addedRes = error['status'] as string[];
          }
        });
    });
    this.refresh = true;
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog.html'
})
export class Dialog {

  constructor(
    public dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    msg: String;
    correct: String;
    msgbool: boolean = true;
    verify(contracts, val, price:String){
      console.log(contracts);
      console.log(val);
      console.log(price)
      if(val == undefined || price == undefined){
        this.msg = "Price and number of contracts are required!";
      }else{
        if(Number(val)>Number(contracts)){
            this.msg = "Number of contracts must be smaller than or equal to: " + this.data['contracts'];
        }else{
            this.correct = "You may close the trade!";
            this.msg = "";
            this.msgbool = false;
        }
      }
    }
    onNoClick(): void {

      this.dialogRef.close();
    }

}
