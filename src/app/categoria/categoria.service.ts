import { Injectable } from '@angular/core';
import { Categoria } from './categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  readonly URL_API = 'http://localhost:3000/api/imagenes/subir';

  constructor() {

   }

   subir_imagen(){

   }
}
