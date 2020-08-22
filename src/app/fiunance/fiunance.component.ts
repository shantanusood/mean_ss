import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EaseInOut } from 'igniteui-angular/lib/animations/easings';
import { AstMemoryEfficientTransformer } from '@angular/compiler';
import { CoronaserviceService } from '../coronaservice.service';

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
  constructor(private http: HttpClient, public dialog: MatDialog, private ds: CoronaserviceService) {


  }
  arrBirds: string[];
  mySubscription: any;
  addedRes: string[];
  loading = true;
  dt: object;
  count:number = 0;
  //readonly baseUrl = "http://localhost:5000/";
  readonly baseUrl = "https://shantanusood.pythonanywhere.com/";
  add = false;
  addtext:string = "+";
  retExp: string[] ;

  ngOnInit() {
    this.ds.current.subscribe(message => this.username = message);
    this.http.get(this.baseUrl + "data/"+this.username+"/expiration").subscribe((data) => {
      this.dt = data as object;
    });
    this.getData();
  }

  getData() {
    this.loading = true;
    console.log("Clicked - Init");
    this.http.get(this.baseUrl + "data/"+this.username+"/monitoring").subscribe((data) => {
      this.arrBirds = data as string[];
      this.loading = false;
    });

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
    return input.reverse();
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
  }
  onClickDelete(ticker: any) {
    this.http
      .get(this.baseUrl + "data/"+this.username+"/monitoring/delete/" + ticker.ticker)
      .subscribe((data) => {
        //console.log(data);
      });
  }

  animal: string;
  name: string;
  onClickDeleteStrike(ticker: any, account: string, type: string, strike: any) {
    const dialogRef = this.dialog.open(Dialog, {
      width: '250px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result['animal'];
      this.name = result['name'];
      this.http
      .get(this.baseUrl + "data/"+this.username+"/monitoring/delete/" + ticker.ticker + "/" + account+ "/" + type + "/" + strike+ "/" + this.animal+ "/" + this.name)
      .subscribe((data) => {
        //console.log(data);
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

  onClickAddVals() {
    var width_num: Number = Number((document.getElementById("contracts") as HTMLInputElement).value)*Number((document.getElementById("collateral") as HTMLInputElement).value);
    var width: string = String(width_num);
    this.http
      .get(
        this.baseUrl +
        "data/"+this.username+"/monitoring/add/" +
          (document.getElementById("account") as HTMLInputElement).value +
          "/" +
          (document.getElementById("ticker") as HTMLInputElement).value +
          "/" +
          width +
          "/" +
          (document.getElementById("exp") as HTMLInputElement).value +
          "/" +
          (document.getElementById("call") as HTMLInputElement).value +
          "/" +
          (document.getElementById("put") as HTMLInputElement).value +
          "/" +
          (document.getElementById("premium") as HTMLInputElement).value
      )
      .subscribe((data) => {
        this.addedRes = data as string[];
        //console.log(data);
      },
      (error) => {
        this.addedRes = error as string[];
      });
    this.http
      .get(
        this.baseUrl +
        "data/"+this.username+"/progress/add/" +
          (document.getElementById("account") as HTMLInputElement).value +
          "/" +
          (document.getElementById("ticker") as HTMLInputElement).value +
          "/" +
          (document.getElementById("contracts") as HTMLInputElement).value +
          "/" +
          (document.getElementById("collateral") as HTMLInputElement).value +
          "/" +
          (document.getElementById("exp") as HTMLInputElement).value +
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

  onNoClick(): void {
    this.dialogRef.close();
  }

}
