import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Constantes} from '../constantes'
import { Categoria } from './categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  categoriaSeleccionada: Categoria;
  categorias: Categoria[];

  constructor(private http: HttpClient) {
    this.categoriaSeleccionada = new Categoria();
  }

  getCategorias(){
    return this.http.get(Constantes.URL_API)
  }

  postCategoria(Categoria: Categoria){
    return this.http.post(Constantes.URL_API,Categoria);
  }
  
  putCategoria(categoria: Categoria){
    return this.http.put(Constantes.URL_API+'/'+categoria._id,categoria);
  }
  deleteCategoria(id: string){
    return this.http.delete(Constantes.URL_API+'/'+id);
  }

  
}
