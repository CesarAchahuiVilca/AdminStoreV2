import { Injectable } from '@angular/core';
import {Pedidos} from './pedidos';
import {Constantes} from '../constantes';
import { HttpClient} from '@angular/common/http'
import { constants } from 'os';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  pedidoselec:Pedidos=new Pedidos();
  pedidos:Pedidos[];

  constructor(public http:HttpClient) { }

  listarpedidos(){
    return this.http.get(Constantes.URL_API_PAGO)
  }
}
