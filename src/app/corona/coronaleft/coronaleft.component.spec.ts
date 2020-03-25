import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoronaleftComponent } from './coronaleft.component';

describe('CoronaleftComponent', () => {
  let component: CoronaleftComponent;
  let fixture: ComponentFixture<CoronaleftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoronaleftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoronaleftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
