import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tutoring',
  templateUrl: './tutoring.component.html',
  styleUrls: ['./tutoring.component.css']
})
export class TutoringComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  economic = false;
  social = false;
  financial = false;

  type: string = "";

  changeType(type: string){
    this.type = type;
    if (type === 'Economic'){
      this.economic = true; this.social = false; this.financial = false;
    }else if (type === 'Social'){
      this.economic = false; this.social = true; this.financial = false;
    }else if (type === 'Financial'){
      this.economic = false; this.social = true; this.financial = false;
    }
  }
}
