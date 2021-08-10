import { Component, OnInit, Inject} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {formatDate} from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EaseInOut } from 'igniteui-angular/lib/animations/easings';
import { AstMemoryEfficientTransformer, compileBaseDefFromMetadata } from '@angular/compiler';
import { CoronaserviceService } from '../coronaservice.service';
import { AppSettings } from '../AppSettings';
import {TooltipPosition} from '@angular/material/tooltip';
import { NavComponent } from '../nav/nav.component';
import { NotificationService } from '../notification.service';

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

export interface Dialog4Data {
}

export interface Dialog5Data {
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
  providers: [NotificationService, NavComponent],
  selector: "app-fiunance",
  templateUrl: "./fiunance.component.html",
  styleUrls: ["./fiunance.component.css"]
})
export class FiunanceComponent implements OnInit {


////////////////////////////NEW/////////////////////////////////
  readonly newbaseUrl = AppSettings.newbaseUrl;
  positions_tick = [];
  colors: object = {};
  passed_val(incoming: Object){
    return incoming;
  }

  changeColor(){
    for(let x in this.colors){
      document.getElementById(x).style.color = this.colors[x]
    }
  }

  updateColors(){
    console.log("=============================")
    console.log("=============================")
    console.log("=============================")
    console.log("=============================")
  }

////////////////////////////////////////////////////////////////







  user_diffdays: any;
  earning_dates = [];
  earning_dates_mobile = [];
  earning_data: object;
  username: string;
  roles: string;
  role_list: object[];
  data_trade_notification: object[];
  constructor(private http: HttpClient, public dialog: MatDialog, private ds: CoronaserviceService, private nt: NotificationService, private nav: NavComponent) {}

  run_spinner: boolean = false;

  stock_close():boolean{
    return false;
  }

  closeStock(){

  }

  arrBirds: string[];
  stocks: string[];
  selectedOption:String;
  selectedLongType:String = "Stock";
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
  all_accounts = [];
  covered:boolean = false;
  ccp: boolean = false;
  callspread:boolean = false;
  putspread:boolean = false;
  butterfly:boolean = false;
  account: String;
  longstock:boolean = false;
  cash:boolean = false;
  cashflow:boolean = false;

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
    this.all_accounts = [];

    this.earning_dates.push(formatDate(new Date().setDate(new Date().getDate() -1), 'yyyy-MM-dd', 'en'))
    this.earning_dates.push(formatDate(new Date(), 'yyyy-MM-dd', 'en'))
    this.earning_dates.push(formatDate(new Date().setDate(new Date().getDate() + 1 ), 'yyyy-MM-dd', 'en'))
    this.earning_dates.push(formatDate(new Date().setDate(new Date().getDate() + 2), 'yyyy-MM-dd', 'en'))
    this.earning_dates.push(formatDate(new Date().setDate(new Date().getDate() + 3), 'yyyy-MM-dd', 'en'))
    this.earning_dates_mobile.push(formatDate(new Date(), 'yyyy-MM-dd', 'en'))
    this.earning_dates_mobile.push(formatDate(new Date().setDate(new Date().getDate() +1), 'yyyy-MM-dd', 'en'))
    this.earning_dates_mobile.push(formatDate(new Date().setDate(new Date().getDate() +2), 'yyyy-MM-dd', 'en'))

    this.http.get(this.baseUrl + "data/calendar/get").subscribe((data) => {
      this.earning_data = data as object;
    });

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
      });
    });
    this.all_accounts = [];
    this.http
      .get(
        this.baseUrl +
          "data/"+this.username+"/accounts")
      .subscribe((data) => {
        this.account_1 = data['fidelity'];
        this.account_2 = data['robinhood'];
        this.account_3 = data['tastyworks'];
        for(var key in data){
          this.all_accounts.push(data[key])
        }
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
////////////////////////////NEW/////////////////////////////////
      this.positions_tick = [];
  this.http.get(this.newbaseUrl + "trade/" + this.username + "/get").subscribe((data) => {

      for(let keys in data){
        this.positions_tick.push({
          Ticker: keys,
          Positions: data[keys]
        });
      }
      this.loading = false;
    });
    this.http.get(this.baseUrl+"data/"+this.username+"/accounts/colors").subscribe((data) =>{
      this.colors = data;
      this.changeColor()
    })



////////////////////////////////////////////////////////////////

  }

  getTopEarnings(date: string){
    if(this.earning_data.hasOwnProperty(date)){
      return this.earning_data[date];

    }
  }
  getTopEarningsLength(date: string){
    if(this.earning_data.hasOwnProperty(date)){
      return this.earning_data[date].length;

    }else{
      return 0;
    }
  }
  runEarnings(date: string){
    this.run_spinner = true;
    this.http.get(this.baseUrl + "data/calendar/"+date+"/1000/10000").subscribe((data) => {
      this.earning_data = data as object;
      this.run_spinner = false;
    });

  }
  reRunEarnings(date: string){
    this.run_spinner = true;
    this.http.get(this.baseUrl + "data/calendar/"+date+"/"+(document.getElementById("volume_threshhold") as HTMLInputElement).value
      +"/"+(document.getElementById("open_threshhold") as HTMLInputElement).value).subscribe((data) => {
      this.earning_data = data as object;
      this.run_spinner = false;
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
      this.ccp = false;
      this.callspread = false;
      this.putspread = false;
      this.longstock = false;
      this.butterfly = false;
      this.cashflow = false;
      this.cash = false;
    }else if(value=='Cash Covered Put'){
      this.covered = false;
      this.ccp = true;
      this.callspread = false;
      this.putspread = false;
      this.longstock = false;
      this.butterfly = false;
      this.cashflow = false;
      this.cash = false;
    }else if(value=='Credit Call Spread'){
      this.callspread = true;
      this.ccp = false;
      this.covered = false;
      this.putspread = false
      this.longstock = false;
      this.butterfly = false;
      this.cashflow = false;
      this.cash = false;
    }else if(value=='Credit Put Spread'){
      this.putspread = true;
      this.ccp = false;
      this.callspread = false;
      this.covered = false;
      this.longstock = false;
      this.butterfly = false;
      this.cashflow = false;
      this.cash = false;
    }else if(value=='Iron Butterfly'){
      this.covered = false;
      this.ccp = false;
      this.callspread = false;
      this.putspread = false;
      this.longstock = false;
      this.butterfly = true;
      this.cash = false;
      this.cashflow = false;
    }else{
      this.covered = false;
      this.ccp = false;
      this.callspread = false;
      this.putspread = false;
      this.longstock = false;
      this.butterfly = false;
      this.cash = false;
      this.cashflow = false;
    }
    if(value=='Long Stock' || value=='Cash' || value =='Cash Flow'){
      this.longstock = true;
      this.cash = false;
      this.cashflow = false;
      if(value == 'Cash' || value =='Cash Flow'){
       this.cash = true;
       this.selectedLongType = "Stock";
       if(value=='Cash Flow'){
         this.cashflow = true;
       }

      }
    }
    this.strategy = value;
  }
  selectOption(value: String) {
    this.selectedOption = value;
   }
   selectLongType(value: String) {
    this.selectedLongType = value;
   }
  processTopExpiration(input: object){
    this.retExp = new Array();
    for(var key in input){
      this.retExp.push(key.toString());
      this.retExp.push(input[key].toString());
    }

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
      .get(this.baseUrl + "data/"+this.username+"/monitoring/delete/getclosedetails/" + ticker.ticker + "/" + account+ "/" + type + "/" + strike)
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
        var trade_type = "";
        if(datax['collateral'] == '0'){
          trade_type = "Covered call";
        }else if(datax['put']==datax['call']){
          trade_type = "Iron Butterfly";
        }else if(datax['put']=='0'){
          trade_type = "Credit call spread";
        }else if(datax['call']=='0'){
          trade_type = "Credit put spread";
        }else{
          trade_type = "Iron Condor";
        }
        this.trade_notification = {
          date: formatDate(new Date(), 'MM/dd/yyyy HH:mm:ss', 'en'),
          status: "unread",
          ticker: ticker.ticker,
          contracts: this.name,
          type: trade_type,
          collateral: datax['collateral'],
          call: datax['call'],
          put: datax['put'],
          expiry: datax['expiry'],
          cost: this.animal,
          pnl: String(((Number(datax['premium']) - Number(this.animal))*100/Number(datax['premium'])).toFixed(0)) + "%"
        }
        this.http
            .post(
              this.baseUrl +
              "data/"+this.username+"/notification/add", this.trade_notification)
            .subscribe((data) => {
              this.data_trade_notification = data as object[];
              this.nav.ngOnInit();

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
        this.covered = false;
        this.ccp = false;
        this.callspread = false;
        this.putspread = false;
        this.butterfly = false;
        this.longstock = false;
        this.cash = false;
        this.cashflow= false;
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
  /* addStock(){
    this.http.get(
      this.baseUrl + "data/"+this.username+"/accounts").subscribe((data) => {
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
  */
  }
  trade_notification: object;
  onClickAddVals() {

    var account = this.selectedOption;
    var strategy = this.strategy;
    if(strategy=="Long Stock"){
      var longtype = this.selectedLongType;
    }else{
      var longtype = new String("N/A");
    }
    var ticker = (document.getElementById("ticker") as HTMLInputElement).value;
    var contracts = (document.getElementById("contracts") as HTMLInputElement).value;
    if(contracts=="0" && !this.longstock){
      this.required_contract = "*";
      this.addedResErr = ["Contracts can't be 0"];
      return;
    }

    var collateral = (document.getElementById("collateral") as HTMLInputElement).value;
    var expiry = this.date;
    var callSide = (document.getElementById("call") as HTMLInputElement).value;
    if((document.getElementById("longcall") as HTMLInputElement)!=null){
      var long_callSide = (document.getElementById("longcall") as HTMLInputElement).value;
    }else{
      var long_callSide = "0";
    }
    var putSide = (document.getElementById("put") as HTMLInputElement).value;
    if((document.getElementById("longput") as HTMLInputElement)!=null){
      var long_putSide = (document.getElementById("longput") as HTMLInputElement).value;
    }else{
      var long_putSide = "0";
    }
    var price = (document.getElementById("premium") as HTMLInputElement).value;
    if(String(long_callSide).length==0){
      long_callSide = String(Number(callSide)+Number(collateral)/100);
    }
    if(String(long_putSide).length==0){
      long_putSide = String(Number(putSide)-Number(collateral)/100);
    }

      if(this.butterfly){
        putSide = callSide;
      }
      if(strategy=="Cash Covered Put"){
        var collateral = String(Number(putSide)*100)
      }

      var dataToAdd ={
        Account:  account,
        TradeDate: new Date(),
        Strategy: strategy,
        Longtype: longtype,
        Ticker: ticker,
        Contracts: contracts,
        Collateral: collateral,
        Expiry: expiry,
        LongCall: long_callSide,
        ShortCall: callSide,
        ShortPut: putSide,
        LongPut: long_putSide,
        Premium:  price
      }

      this.http.post(this.newbaseUrl + "trade/" + this.username + "/add", dataToAdd).subscribe((data) => {
        this.addedRes = [String(account), String(strategy), " Successfully added!"]

      },(error) => {
          this.addedRes = []
          this.addedResErr = [error["status"] , error["statusText"]];
      });

      this.selectedOption = "";
      this.ngOnInit();
    /* this.http.get(
      this.baseUrl + "data/"+this.username+"/accounts").subscribe((data) => {
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
            callSide +
            "/" +
            putSide +
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
            callSide +
            "/" +
            putSide +
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
    var trade_type = "";
    if((document.getElementById("collateral") as HTMLInputElement).value == '0'){
      trade_type = "Covered call";
    }else if(putSide==callSide){
      trade_type = "Iron Butterfly";
    }else if(putSide=='0'){
      trade_type = "Credit call spread";
    }else if(callSide=='0'){
      trade_type = "Credit put spread";
    }else{
      trade_type = "Iron Condor";
    }
    var dateArray = this.date.split("-");
    var year = parseInt(dateArray[0]);
    var month = parseInt(dateArray[1], 10) - 1;
    var date = parseInt(dateArray[2]);
    this.trade_notification = {
      date: formatDate(new Date(), 'MM/dd/yyyy HH:mm:ss', 'en'),
      status: "unread",
      ticker: (document.getElementById("ticker") as HTMLInputElement).value,
      contracts: (document.getElementById("contracts") as HTMLInputElement).value,
      type: trade_type,
      collateral: (document.getElementById("collateral") as HTMLInputElement).value,
      expiry: formatDate(new Date(year, month, date), 'dd-MMM', 'en'),
      call: callSide,
      put: putSide,
      premium: (document.getElementById("premium") as HTMLInputElement).value
    }
    this.http
        .post(
          this.baseUrl +
          "data/"+this.username+"/notification/add", this.trade_notification)
        .subscribe((data) => {
          this.data_trade_notification = data as object[];
          this.nav.ngOnInit();

        });
    this.refresh = true; */
  }

  rearrange(){

    this.http.get(this.newbaseUrl + "display/"+this.username+"/rearrange/get").subscribe((datax) => {
      datax['url'] = this.baseUrl;
      datax['username'] = this.username;
      const dialogRef = this.dialog.open(Dialog4, {
        width: '500px',
        data: datax,
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result.length>0){
          this.http.post(this.newbaseUrl + "display/"+this.username+"/rearrange/update", result).subscribe((datax) => {
          });
        }else{
          console.log("Did not trigger");
        }
        this.ngOnInit();
      });
    });

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


        //Close the trade
        this.http
        .get(this.baseUrl + "data/"+this.username+"/monitoring/delete/" + data.ticker + "/" + vals[_strike][0]
              + "/" + _type + "/" + _strike+ "/" + result['ret']['price']+ "/" + result['ret']['contracts'])
        .subscribe((data) => {
          //console.log(data);
        });

        this.trade_notification = {
          date: formatDate(new Date(), 'MM/dd/yyyy HH:mm:ss', 'en'),
          status: "unread",
          ticker: data.ticker,
          contracts: result['ret']['contracts'],
          type: _type,
          strike: _strike,
          cost: result['ret']['price']
        }
        this.http
            .post(
              this.baseUrl +
              "data/"+this.username+"/notification/add", this.trade_notification)
            .subscribe((data) => {
              this.data_trade_notification = data as object[];
              this.nav.ngOnInit();

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

          this.trade_notification = {
            date: formatDate(new Date(), 'MM/dd/yyyy HH:mm:ss', 'en'),
            status: "unread",
            ticker: data.ticker,
            contracts: result['ret']['opencontracts'],
            collateral: result['ret']['opencollateral'],
            expiry: result['ret']['openexpiry'],
            call: result['ret']['opencall'],
            put: result['ret']['openput'],
            premium: result['ret']['premium']
          }
          this.http
              .post(
                this.baseUrl +
                "data/"+this.username+"/notification/add", this.trade_notification)
              .subscribe((data) => {
                this.data_trade_notification = data as object[];
                this.nav.ngOnInit();

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

  viewtrade(data: any, vals: any, _type: string, _strike: any){
    this.http.get(this.baseUrl + "data/"+this.username+"/monitoring/delete/getcontracts/" +
      data.ticker + "/" + vals[_strike][0]+ "/" + _type + "/" + _strike).subscribe((datax) => {

        const dialogRef = this.dialog.open(Dialog5, {
          width: '300px',
          data: {
            stock: data, datax: vals as string[], type: _type, strike: _strike, contracts: datax['contracts'], username: this.username, ticker: data.ticker,
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

@Component({
  selector: 'dialog-overview-example-dialog4',
  templateUrl: './dialog4.html',
  styleUrls: ["./dialog4.css"]
})
export class Dialog4 {

  constructor(
    public dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: Dialog4Data, private http: HttpClient) {
      for(let key in data){
        console.log(this.movies)
        this.movies.push(data[key])
      }
      this.movies.pop()
      this.movies.pop()

      this.http.get(data['url']+"data/"+data['username']+"/accounts/colors").subscribe((data) =>{
        this.colors = data;
      })
    }
    movies = [];
    colors: object = {};

    drop(event: CdkDragDrop<string[]>) {
      moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

}

@Component({
  selector: 'dialog-overview-example-dialog5',
  templateUrl: './dialog5.html',
  styleUrls: ["./dialog5.css"]
})
export class Dialog5 implements OnInit{

  constructor(public dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: Dialog5Data, private http: HttpClient) {


    }
  ngOnInit() {
      this.getPrice(this.getClickedPosition(this.data['datax'], this.data['strike']));
  }
    readonly baseUrl = AppSettings.baseUrl;

    close_call: string;
    run_spinner: boolean = true;
    close_put: string;
    close_collateral: string;
    msg: String;
    correct: String;
    msgbool: boolean = true;
    ret_price: String;
    getPrice(vals: String[]){
      vals.push(this.data['ticker']);
      this.http.post(this.baseUrl + "data/"+this.data['username']+"/spread/get", vals)
        .subscribe((data) => {
          this.ret_price = data['value'] as String;
          this.run_spinner = false;
      });
    }

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
        this.data.ret.openput = put;
      }
      if(this.close_call=='0'){
        this.data.ret.opencall = call;
      }
      if(collateral=='0'){
        this.data.ret.opencollateral = collateral;
      }

      return [account, contracts, collateral, expiry, call, put, premium];

    }

    onNoClick(): void {

      this.dialogRef.close();
    }

    getTypeOfTrade(vals: String[]){
      if(vals[2]=='0'){
        return "Covered call";
      }else if(vals[4]==vals[5]){
        return "Iron Butterfly";
      }else if(vals[4]=='0'){
        return "Credit call spread";
      }else if(vals[5]=='0'){
        return "Credit put spread";
      }else{
        return "Iron Condor";
      }
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
