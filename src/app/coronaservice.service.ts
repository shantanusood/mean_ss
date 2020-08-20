import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class CoronaserviceService {

  constructor() { }
  private subject = new BehaviorSubject<any>("");
  current = this.subject.asObservable();

    sendData(message: string) {
        this.subject.next(message);
    }


    public getData(): Observable<any> {
        return this.subject.asObservable();
    }
}
