import { TestBed } from '@angular/core/testing';

import { ArticuloService } from './articulo.service';

describe('ArticuloService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArticuloService = TestBed.get(ArticuloService);
    expect(service).toBeTruthy();
  });
});
