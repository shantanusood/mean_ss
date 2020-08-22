import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechieComponent } from './techie.component';

describe('TechieComponent', () => {
  let component: TechieComponent;
  let fixture: ComponentFixture<TechieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
