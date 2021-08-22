import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradegainsComponent } from './tradegains.component';

describe('TradegainsComponent', () => {
  let component: TradegainsComponent;
  let fixture: ComponentFixture<TradegainsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradegainsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradegainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
