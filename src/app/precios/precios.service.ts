import { Constantes } from '../constantes';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PreciosService {

  constructor(public http: HttpClient) { }


  obtenerPrecioArticulo(idarticuloglobal){
    return this.http.get(Constantes.URL_API_PRECIOS+ '//obtener-precio/'+idarticuloglobal, {withCredentials: true});

  }
  descargarBaseExcel(){
    return this.http.get(Constantes.URL_API_PRECIOS+ '/generar-reporte-excel', {withCredentials: true,responseType: 'blob'});
  }
  guardarPreciosVenta(data){
    return this.http.post(Constantes.URL_API_PRECIOS+ '/guardar-lista-precios',data, {withCredentials: true});

  }
}
