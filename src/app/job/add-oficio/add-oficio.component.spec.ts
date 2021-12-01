import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOficioComponent } from './add-oficio.component';

describe('AddOficioComponent', () => {
  let component: AddOficioComponent;
  let fixture: ComponentFixture<AddOficioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOficioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
