import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-fiunance",
  templateUrl: "./fiunance.component.html",
  styleUrls: ["./fiunance.component.css"],
})
export class FiunanceComponent implements OnInit {
  constructor(private http: HttpClient) {}
  arrBirds: string[];
  readonly baseUrl = "http://localhost:5000/";
  add = false;

  ngOnInit() {
    this.http.get(this.baseUrl + "data/monitoring").subscribe((data) => {
      this.arrBirds = data as string[];
    });
  }

  onClickDelete(ticker: any) {
    this.http
      .get(this.baseUrl + "data/monitoring/delete/" + ticker.ticker)
      .subscribe((data) => {
        console.log(data);
      });
  }

  onClickDeleteStrike(ticker: any, value: any, account: string, type: string) {
    this.http
      .get(this.baseUrl + "data/monitoring/delete/" + ticker.ticker + "/" + account+ "/" + type + "/" + value)
      .subscribe((data) => {
        console.log(data);
      });
  }

  onClickAdd() {
    this.add = true;
  }

  onClickAddVals() {
    this.http
      .get(
        this.baseUrl +
          "data/monitoring/add/" +
          (document.getElementById("account") as HTMLInputElement).value +
          "/" +
          (document.getElementById("ticker") as HTMLInputElement).value +
          "/" +
          (document.getElementById("width") as HTMLInputElement).value +
          "/" +
          (document.getElementById("call") as HTMLInputElement).value +
          "/" +
          (document.getElementById("put") as HTMLInputElement).value
      )
      .subscribe((data) => {
        console.log(data);
      });
  }
}
