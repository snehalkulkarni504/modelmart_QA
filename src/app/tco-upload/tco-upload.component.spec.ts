import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcoUploadComponent } from './tco-upload.component';

describe('TcoUploadComponent', () => {
  let component: TcoUploadComponent;
  let fixture: ComponentFixture<TcoUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TcoUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TcoUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
