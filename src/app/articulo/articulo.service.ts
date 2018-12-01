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
  articuloSeleccionado: Articulo = new Articulo();
  articulosMysql: ArticuloMysql[];

  constructor(private http: HttpClient) {
    this.articuloSeleccionadoMysql = new ArticuloMysql();
  }

  getArticulosMysql(){
    return this.http.get(Constantes.URL_API_ARTICULO)
  }
  getImagenes(){
    return this.http.get(Constantes.URL_API_IMAGEN);
  }

  postArticulo(articulo: Articulo){
    return this.http.post(Constantes.URL_API_ARTICULO,articulo);
  }
  
  putCategoria(articulo: Articulo){
    return this.http.put(Constantes.URL_API_ARTICULO+'/'+articulo._id,articulo);
  }
}
