import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CoronaserviceService {

  private messageSource = new BehaviorSubject<string>("<- Click on ticker to see trades");
  currentMessage = this.messageSource.asObservable();

  constructor() {
  }

  changeMessage(message: string){
    this.messageSource.next(message);
  }
}
