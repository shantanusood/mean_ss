import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CoronaserviceService {

  private messageSource = new BehaviorSubject<string>("Default Message");
  currentMessage = this.messageSource.asObservable();

  constructor() {
  }

  changeMessage(message: string){
    this.messageSource.next(message);
  }
}
