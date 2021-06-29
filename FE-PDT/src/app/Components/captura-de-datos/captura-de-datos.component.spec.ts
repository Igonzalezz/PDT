import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapturaDeDatosComponent } from './captura-de-datos.component';

describe('CapturaDeDatosComponent', () => {
  let component: CapturaDeDatosComponent;
  let fixture: ComponentFixture<CapturaDeDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapturaDeDatosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturaDeDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
