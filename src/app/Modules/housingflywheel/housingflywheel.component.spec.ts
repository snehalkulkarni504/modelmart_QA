import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingflywheelComponent } from './housingflywheel.component';

describe('HousingflywheelComponent', () => {
  let component: HousingflywheelComponent;
  let fixture: ComponentFixture<HousingflywheelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HousingflywheelComponent]
    });
    fixture = TestBed.createComponent(HousingflywheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
