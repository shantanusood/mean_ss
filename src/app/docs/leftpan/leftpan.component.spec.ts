import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftpanComponent } from './leftpan.component';

describe('LeftpanComponent', () => {
  let component: LeftpanComponent;
  let fixture: ComponentFixture<LeftpanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftpanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftpanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
