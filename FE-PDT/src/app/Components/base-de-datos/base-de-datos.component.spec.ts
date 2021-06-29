import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDeDatosComponent } from './base-de-datos.component';

describe('BaseDeDatosComponent', () => {
  let component: BaseDeDatosComponent;
  let fixture: ComponentFixture<BaseDeDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseDeDatosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDeDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
