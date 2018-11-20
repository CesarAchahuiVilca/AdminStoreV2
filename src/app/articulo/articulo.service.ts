import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Constantes} from '../constantes'
import { Articulo } from './articulo';
import { ArticuloMysql } from './articuloMysql';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  articuloSeleccionadoMysql: ArticuloMysql = new ArticuloMysql();
  articulosMysql: ArticuloMysql[];

  constructor(private http: HttpClient) {
    this.articuloSeleccionadoMysql = new ArticuloMysql();
  }

  getArticulosMysql(){
    return this.http.get(Constantes.URL_API_ARTICULO)
  }
}
