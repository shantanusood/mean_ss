import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiunanceComponent } from './fiunance.component';

describe('FiunanceComponent', () => {
  let component: FiunanceComponent;
  let fixture: ComponentFixture<FiunanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiunanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiunanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
