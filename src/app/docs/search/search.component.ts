import { Component, HostListener, Inject, OnInit, Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{

  public towns = [];
  public townSelected;

  stocks = false;
  etfs = false;
  index = false;
  mutual = false;
  futures = false;
  currency = false;
  options = false;

  type:string = "";

  constructor(private http: HttpClient) {

      /*this.towns = [
          "New York", "Washington, D.C.", "London", "Berlin", "Sofia", "Rome", "Kiev",
          'Copenhagen', "Paris", "Barcelona", "Vienna", "Athens", "Dublin", "Yerevan",
          "Oslo", "Helsinki", "Stockholm", "Prague", "Istanbul", "El Paso", "Florence", "Moscow",
          "Jambol", "Talin", "Zlatna Panega", "Queenstown", "Gabrovo", "Ugurchin", "Xanthi"
        ];*/
  }
  ngOnInit() {

  }

  changeType(type: string){
    this.type = type;
    if (type === 'Stocks'){
      this.stocks = true; this.etfs = false; this.index = false; this.mutual = false; this.futures = false; this.currency = false; this.options = false;
    }else if (type === 'ETFs'){
      this.stocks = false; this.etfs = true; this.index = false; this.mutual = false; this.futures = false; this.currency = false; this.options = false;
    }else if (type === 'Index'){
      this.stocks = false; this.etfs = false; this.index = true; this.mutual = false; this.futures = false; this.currency = false; this.options = false;
    }else if (type === 'MutualFunds'){
      this.stocks = false; this.etfs = false; this.index = false; this.mutual = true; this.futures = false; this.currency = false; this.options = false;
    }else if (type === 'Futures'){
      this.stocks = false; this.etfs = false; this.index = false; this.mutual = false; this.futures = true; this.currency = false; this.options = false;
    }else if (type === 'Currency'){
      this.stocks = false; this.etfs = false; this.index = false; this.mutual = false; this.futures = false; this.currency = true; this.options = false;
    }

    this.http.get('http://localhost:5000/csv/'+this.type, { responseType: 'text' as 'json'}).subscribe(res => {
      this.towns = res.toString().split(',');
    });
  }

}

@Pipe({ name: 'contains' })
export class AutocompletePipeStartsWith implements PipeTransform {
  public transform(collection: any[], term = '') {
      return collection.filter((item) => item.toString().toLowerCase().includes(term.toString().toLowerCase()));
  }
}
