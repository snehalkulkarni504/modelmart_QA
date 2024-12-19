import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostReductionComponent } from './cost-reduction.component';

describe('CostReductionComponent', () => {
  let component: CostReductionComponent;
  let fixture: ComponentFixture<CostReductionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CostReductionComponent]
    });
    fixture = TestBed.createComponent(CostReductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
