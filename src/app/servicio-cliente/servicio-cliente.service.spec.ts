import { TestBed } from '@angular/core/testing';

import { ServicioClienteService } from './servicio-cliente.service';

describe('ServicioClienteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServicioClienteService = TestBed.get(ServicioClienteService);
    expect(service).toBeTruthy();
  });
});
