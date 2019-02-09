import { Injectable } from '@angular/core';
import {Pedidos} from './pedidos';
import {Constantes} from '../constantes';
import { HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  pedidoselec:Pedidos=new Pedidos();
  pedidos:Pedidos[];

  constructor(public http:HttpClient) { }

  listarpedidos(){
    return this.http.get(Constantes.URL_API_PAGO);
  }
  actualizarpedido(pedido:Pedidos){
    return this.http.put(Constantes.URL_API_PAGO + `/${pedido._id}`,pedido);
  }
  eliminarpedido(_id:string){
    return this.http.delete(Constantes.URL_API_PAGO  + `/${_id}`);
  }
  listarpedidouni(_id:string){
    return this.http.get(Constantes.URL_API_PAGO+'/'+_id);
  }
  recuperardireccion(_id:string){
    return this.http.get(Constantes.URL_API_DIRECCION+'/uni/'+_id);
  }
  recuperarserielocal(){
    return this.http.get(Constantes.URL_API_PAGO+'/serielocal/');
  }
}
