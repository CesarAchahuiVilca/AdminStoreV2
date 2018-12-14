import { TestBed } from '@angular/core/testing';

import { TiendaService } from './tienda.service';

describe('TiendaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TiendaService = TestBed.get(TiendaService);
    expect(service).toBeTruthy();
  });
});
