import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictdocComponent } from './predictdoc.component';

describe('PredictdocComponent', () => {
  let component: PredictdocComponent;
  let fixture: ComponentFixture<PredictdocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredictdocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictdocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
