import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EaseInOut } from 'igniteui-angular/lib/animations/easings';
import { AstMemoryEfficientTransformer } from '@angular/compiler';
import { CoronaserviceService } from '../coronaservice.service';
import { AppSettings } from '../AppSettings';
import {TooltipPosition} from '@angular/material/tooltip';

export interface DialogData {
  animal: string;
  name: string;
}

export interface Dialog2Data {
  stock: String,
  acc: String,
  available: String,
  contracts: String
}

export interface Dialog3Data {
  stock: object,
  datax: string[],
  type: string,
  strike: string,
  contracts: string,
  ret: {
    contracts: string,
    price: string,
    opencontracts: string,
    opencollateral: string,
    openexpiry: string,
    opencall: string,
    openput: string,
    premium: string
  }
}

@Component({
  selector: "app-fiunance",
  templateUrl: "./fiunance.component.html",
  styleUrls: ["./fiunance.component.css"]
})
export class FiunanceComponent implements OnInit {

  user_diffdays: any;

  username: string;
  roles: string;
  role_list: object[];
  constructor(private http: HttpClient, public dialog: MatDialog, private ds: CoronaserviceService) {}

  stock_close():boolean{
    return false;
  }

  closeStock(){

  }

  arrBirds: string[];
  stocks: string[];
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
  longstock:boolean = false;

  isTickerEmpty(data: object){
    var count = 0;
    Object.values(data['positions']).forEach(x => {
      var y = x['exp'] as object[];
      if(y.length>0){
        count ++;
      }
      if(Number(data['price'])==0){
        count = 0;
      }
    });

    if(count>0){
      return false;

    }else{
      return true;

    }
  }
  refresh: boolean = false;

  ngOnInit() {
    this.ds.current.subscribe(message => this.username = message);
    this.http.get(this.baseUrl + "data/"+this.username+"/expiration").subscribe((data) => {
      this.dt = data as object;
    });
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
        console.log(d['userid']);
        console.log(d['role']);
      });
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
      this.http.get(this.baseUrl + "data/"+this.username+"/stocks/get/temp").subscribe((data) => {
        this.stocks = data as string[];
        if(this.stocks.length==0){
          this.stocks = undefined;
        }
      });
      this.http.get(this.baseUrl + "data/"+this.username+"/monitoring/temp").subscribe((data) => {
        this.arrBirds = data as string[];

        for(var k in this.arrBirds){
          this.arrBirds[k]['ordered']['call'].reverse();
          this.arrBirds[k]['ordered']['put'].reverse();
        }

        this.loading = false;
      });
  }

  getData() {
    this.loading = true;
    this.http.get(this.baseUrl + "data/"+this.username+"/monitoring").subscribe((data) => {
      this.arrBirds = data as string[];

      for(var k in this.arrBirds){
        this.arrBirds[k]['ordered']['call'].reverse();
        this.arrBirds[k]['ordered']['put'].reverse();
      }

    });
    this.http.get(this.baseUrl + "data/"+this.username+"/stocks/get").subscribe((data) => {
      this.stocks = data as string[];
      if(this.stocks.length==0){
        this.stocks = undefined;
      }
      this.loading = false;

    });
  }
  selectStrat(value: String){
    if(value=='Covered Call'){
      this.covered = true;
      this.callspread = false;
      this.putspread = false;
      this.longstock = false;
    }else if(value=='Credit Call Spread'){
      this.callspread = true;
      this.covered = false;
      this.putspread = false
      this.longstock = false;
    }else if(value=='Credit Put Spread'){
      this.putspread = true;
      this.callspread = false;
      this.covered = false;
      this.longstock = false;
    }else{
      this.covered = false;
      this.callspread = false;
      this.putspread = false;
      this.longstock = false;
    }
    if(value=='Long Stock'){
      this.longstock = true;
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
        this.selectedOption = undefined;
        this.strategy = undefined;
        this.required_ticker = undefined;
        this.required_contract = undefined;
        this.required_coll = undefined;
        this.required_exp = undefined;
        this.required_call = undefined;
        this.required_put = undefined;
        this.required_prem = undefined;
        this.longstock = false;
      }
  }
  date: string;
  changeDueDate(){
    this.date = (document.getElementById("exp") as HTMLInputElement).value;
  }
  required_msg:String;
  required_strategy:String;
  required_ticker:String;
  required_contract:String;
  required_coll:String;
  required_exp:String;
  required_call:String;
  required_put:String;
  required_prem:String;
  clickAdd(){
    if(this.selectedOption==undefined || this.selectedOption.length==0){
      this.required_msg = "*";
    }else{
      this.required_msg = "";
    }
    if(this.strategy==undefined || this.strategy.length==0){
      this.required_strategy = "*";
    }else{
      this.required_strategy = "";
    }
    if((document.getElementById("ticker") as HTMLInputElement).value.length==0){
      this.required_ticker = "*";
    }else{
      this.required_ticker = "";
    }
    if((document.getElementById("contracts") as HTMLInputElement).value.length==0){
      this.required_contract = "*";
    }else{
      this.required_contract = "";
    }
    if((document.getElementById("collateral") as HTMLInputElement).value.length==0){
      this.required_coll = "*";
    }else{
      this.required_coll = "";
    }
    if((document.getElementById("exp") as HTMLInputElement).value.length==0){
      this.required_exp = "*";
    }else{
      this.required_exp = "";
    }
    if((document.getElementById("call") as HTMLInputElement).value.length==0){
      this.required_call = "*";
    }else{
      this.required_call = "";
    }
    if((document.getElementById("put") as HTMLInputElement).value.length==0){
      this.required_put = "*";
    }else{
      this.required_put = "";
    }
    if((document.getElementById("premium") as HTMLInputElement).value.length==0){
      this.required_prem = "*";
    }else{
      this.required_prem = "";
    }
    if(this.required_msg || this.required_strategy || this.required_ticker || this.required_contract || this.required_coll || this.required_exp || this.required_call || this.required_put || this.required_prem){
      console.log("requirement not fulfilled");
    }else{
      this.onClickAddVals();
    }
  }
  clickAddStock(){
    if(this.selectedOption==undefined || this.selectedOption.length==0){
      this.required_msg = "*";
    }else{
      this.required_msg = "";
    }
    if(this.strategy==undefined || this.strategy.length==0){
      this.required_strategy = "*";
    }else{
      this.required_strategy = "";
    }
    if((document.getElementById("ticker") as HTMLInputElement).value.length==0){
      this.required_ticker = "*";
    }else{
      this.required_ticker = "";
    }
    if((document.getElementById("collateral") as HTMLInputElement).value.length==0){
      this.required_coll = "*";
    }else{
      this.required_coll = "";
    }
    if((document.getElementById("premium") as HTMLInputElement).value.length==0){
      this.required_prem = "*";
    }else{
      this.required_prem = "";
    }
    if(this.required_msg || this.required_strategy || this.required_ticker || this.required_coll || this.required_prem){
      console.log("requirement not fulfilled");
    }else{
      this.addStock();
    }
  }
  del_acc:String;
  del_shares:String;
  delStock(ticker: string, account: string, shares: string){

        const dialogRef = this.dialog.open(Dialog2, {
          width: '300px',
          data: {stock: ticker, acc: account, available: shares, contracts: "0"}
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog2 was closed');
        this.del_shares = result['contracts']
        this.http
        .get(this.baseUrl + "data/"+this.username+"/delstocks/"+ticker+"/"+account+"/"+this.del_shares)
        .subscribe((data) => {
          this.stocks = data as string[];
          this.refresh = true;
        });
      });

 }
  addStock(){
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
        this.http.get(
          this.baseUrl + "data/"+this.username+"/stocks/"+
          (document.getElementById("ticker") as HTMLInputElement).value + "/"+
          (document.getElementById("premium") as HTMLInputElement).value + "/"+
          this.account + "/"+
          (document.getElementById("collateral") as HTMLInputElement).value).subscribe((data) => {
            this.stocks = data as string[];
            if(this.stocks.length==0){
              this.stocks = undefined;
            }
          });
    });

      this.refresh = true;
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

  rolltrade(data: any, vals: any, _type: string, _strike: any){
    this.http.get(this.baseUrl + "data/"+this.username+"/monitoring/delete/getcontracts/" +
      data.ticker + "/" + vals[_strike][0]+ "/" + _type + "/" + _strike).subscribe((datax) => {

        const dialogRef = this.dialog.open(Dialog3, {
          width: '600px',
          data: {
            stock: data, datax: vals as string[], type: _type, strike: _strike, contracts: datax['contracts'],
            ret: {
              contracts: "",
              price: "",
              opencontracts: "",
              opencollateral: "",
              openexpiry: "",
              opencall: "",
              openput: "",
              premium: ""
            }
          }
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log("---------------------------------");
        console.log(result['ret']['contracts']);
        console.log(result['ret']['opencontracts']);
        console.log("---------------------------------");
        console.log(result['ret']['opencollateral']);
        console.log("---------------------------------");

        //Close the trade
        this.http
        .get(this.baseUrl + "data/"+this.username+"/monitoring/delete/" + data.ticker + "/" + vals[_strike][0]
              + "/" + _type + "/" + _strike+ "/" + result['ret']['price']+ "/" + result['ret']['contracts'])
        .subscribe((data) => {
          //console.log(data);
        });

        var width_num: Number = Number(result['ret']['opencollateral'])*Number(result['ret']['opencontracts']);
        var width: string = String(width_num);
        //Open new trade
        this.http.get(this.baseUrl +
              "data/"+this.username+"/monitoring/add/" + vals[_strike][0] + "/" + data.ticker + "/" + width + "/" +
              result['ret']['openexpiry'] + "/" + result['ret']['opencall'] + "/" + result['ret']['openput'] + "/" + result['ret']['premium']
            ).subscribe((data) => {
              this.addedRes = data as string[];
              this.addedResErr = [];
            },
          (error) => {
            this.addedRes = []
            this.addedResErr = error["statusText"] as string[];
          });

        this.http.get(this.baseUrl +
            "data/"+this.username+"/progress/add/" + vals[_strike][0] + "/" + data.ticker + "/" + result['ret']['opencontracts'] + "/" +
            result['ret']['opencollateral'] + "/" + result['ret']['openexpiry'] + "/" + result['ret']['opencall'] + "/" + result['ret']['openput']
            + "/" + result['ret']['premium']).subscribe((data) => {
            //console.log(data);
          },
          (error) => {
            if(error['status'].toString() === '404'){
              this.addedRes = ['All fields required'];
            }else{
              this.addedRes = error['status'] as string[];
            }
          });
        this.refresh = true;
      });
    });
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
    getContracts(data: any){
      return data['contracts'];

    }
    verify(contracts, val, price:String){
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
@Component({
  selector: 'dialog-overview-example-dialog2',
  templateUrl: './dialog2.html'
})
export class Dialog2 {

  constructor(
    public dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: Dialog2Data) {}

    getAvailable(data: any){
      return data['available'];

    }
    getStock(data){
      return data['stock'];

    }
    getContracts(data: any){
      return data['contracts'];

    }
    onNoClick(): void {

      this.dialogRef.close();
    }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog3.html'
})
export class Dialog3 {

  constructor(public dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: Dialog3Data) {


    }

    close_call: string;
    close_put: string;
    close_collateral: string;
    msg: String;
    correct: String;
    msgbool: boolean = true;

    getClickedPosition(vals: string[], strike: string){

      var account:string = vals[strike][0];
      var contracts:string = this.data.contracts;
      var collateral:string = vals[strike][2];
      var expiry:string = vals[strike][1];
      var call:string;
      var put: string;
      var premium:string = vals[strike][3];
      var positions: object = this.data.stock['positions'][account];

      for(let i = 0; i < positions[this.data.type].length; i++){
        if(positions[this.data.type][i]==this.data.strike && positions['exp'][i]==expiry && positions['coll'][i]==collateral && positions['prem'][i]==premium){
          call = positions['call'][i];
          put = positions['put'][i];
          this.close_call = call;
          this.close_put = put;
        }
      }

      //this.data.ret.contracts = contracts;
      //this.data.ret.opencontracts = contracts;
      //this.data.ret.opencollateral = collateral;
      //this.data.ret.opencall = call;
      //this.data.ret.openput = put;

      if(this.close_put=='0'){
        (<HTMLInputElement> document.getElementById("closeput")).disabled = true;
        this.data.ret.openput = put;
      }
      if(this.close_call=='0'){
        (<HTMLInputElement> document.getElementById("closecall")).disabled = true;
        this.data.ret.opencall = call;
      }
      if(collateral=='0'){
        (<HTMLInputElement> document.getElementById("closecollateral")).disabled = true;
        this.data.ret.opencollateral = collateral;
      }

      return [account, contracts, collateral, expiry, call, put, premium];

    }

    onNoClick(): void {

      this.dialogRef.close();
    }


    required_closecontract = undefined;
    required_cost = undefined;
    required_coll = undefined;
    required_exp = undefined;
    required_call = undefined;
    required_put = undefined;
    required_prem = undefined;
    required_contract = undefined;
    verify(){
      if((document.getElementById("closecontracts") as HTMLInputElement).value.length==0){
        this.required_closecontract = "*";
      }else{
        this.required_closecontract = "";
      }
      if((document.getElementById("cost") as HTMLInputElement).value.length==0){
        this.required_cost = "*";
      }else{
        this.required_cost = "";
      }
      if((document.getElementById("opencontracts") as HTMLInputElement).value.length==0){
        this.required_contract = "*";
      }else{
        this.required_contract = "";
      }
      if((document.getElementById("closecollateral") as HTMLInputElement).value.length==0){
        this.required_coll = "*";
      }else{
        this.required_coll = "";
      }
      if((document.getElementById("exp") as HTMLInputElement).value.length==0){
        this.required_exp = "*";
      }else{
        this.required_exp = "";
      }
      if((document.getElementById("closecall") as HTMLInputElement).value.length==0){
        this.required_call = "*";
      }else{
        this.required_call = "";
      }
      if((document.getElementById("closeput") as HTMLInputElement).value.length==0){
        this.required_put = "*";
      }else{
        this.required_put = "";
      }
      if((document.getElementById("premium") as HTMLInputElement).value.length==0){
        this.required_prem = "*";
      }else{
        this.required_prem = "";
      }
      if(this.required_contract || this.required_coll || this.required_exp || this.required_call || this.required_put || this.required_prem){
        console.log("requirement not fulfilled");
      }else{
        this.msgbool = false;
      }
    }

}
