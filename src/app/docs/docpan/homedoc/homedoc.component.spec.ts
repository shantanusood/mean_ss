import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomedocComponent } from './homedoc.component';

describe('HomedocComponent', () => {
  let component: HomedocComponent;
  let fixture: ComponentFixture<HomedocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomedocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomedocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
