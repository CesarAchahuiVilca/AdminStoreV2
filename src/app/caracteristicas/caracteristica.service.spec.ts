import { TestBed } from '@angular/core/testing';

import { CaracteristicaService } from './caracteristica.service';

describe('CaracteristicaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CaracteristicaService = TestBed.get(CaracteristicaService);
    expect(service).toBeTruthy();
  });
});
