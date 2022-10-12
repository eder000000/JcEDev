import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalCardErrorComponent } from './professional-card-error.component';

describe('ProfessionalCardErrorComponent', () => {
  let component: ProfessionalCardErrorComponent;
  let fixture: ComponentFixture<ProfessionalCardErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionalCardErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalCardErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
