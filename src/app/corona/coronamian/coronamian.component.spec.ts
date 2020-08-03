import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoronamianComponent } from './coronamian.component';

describe('CoronamianComponent', () => {
  let component: CoronamianComponent;
  let fixture: ComponentFixture<CoronamianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoronamianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoronamianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
