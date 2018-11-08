import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallemarcaComponent } from './detallemarca.component';

describe('DetallemarcaComponent', () => {
  let component: DetallemarcaComponent;
  let fixture: ComponentFixture<DetallemarcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallemarcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallemarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
