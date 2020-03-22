import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocpanComponent } from './docpan.component';

describe('DocpanComponent', () => {
  let component: DocpanComponent;
  let fixture: ComponentFixture<DocpanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocpanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocpanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
