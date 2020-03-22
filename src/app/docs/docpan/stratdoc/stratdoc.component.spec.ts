import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StratdocComponent } from './stratdoc.component';

describe('StratdocComponent', () => {
  let component: StratdocComponent;
  let fixture: ComponentFixture<StratdocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StratdocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StratdocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
