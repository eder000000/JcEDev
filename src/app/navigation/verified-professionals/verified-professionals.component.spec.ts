import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiedProfessionalsComponent } from './verified-professionals.component';

describe('VerifiedProfessionalsComponent', () => {
  let component: VerifiedProfessionalsComponent;
  let fixture: ComponentFixture<VerifiedProfessionalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifiedProfessionalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiedProfessionalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
