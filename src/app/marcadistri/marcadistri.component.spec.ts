import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcadistriComponent } from './marcadistri.component';

describe('MarcadistriComponent', () => {
  let component: MarcadistriComponent;
  let fixture: ComponentFixture<MarcadistriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarcadistriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcadistriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
