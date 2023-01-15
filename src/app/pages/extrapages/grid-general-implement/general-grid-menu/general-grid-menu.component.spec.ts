import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralGridMenuComponent } from './general-grid-menu.component';

describe('GeneralGridMenuComponent', () => {
  let component: GeneralGridMenuComponent;
  let fixture: ComponentFixture<GeneralGridMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralGridMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralGridMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
