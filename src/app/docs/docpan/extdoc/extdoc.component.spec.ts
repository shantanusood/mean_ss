import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtdocComponent } from './extdoc.component';

describe('ExtdocComponent', () => {
  let component: ExtdocComponent;
  let fixture: ComponentFixture<ExtdocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtdocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtdocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
