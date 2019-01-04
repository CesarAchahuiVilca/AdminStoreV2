import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Constantes} from '../constantes';
import { TipoPlan} from './tipoplan';
import { Plan} from './plan';

@Injectable({
  providedIn: 'root'
})
export class PlanesService {

  tipoPlanSeleccionado : TipoPlan  = new TipoPlan();
  tipoplanes: TipoPlan[];
  planSeleccionado: Plan = new Plan();
  constructor(private http: HttpClient) { 

  }

  getTipoPlanes(){
    return this.http.get(Constantes.URL_API_PLANES, {withCredentials: true});
  }

  getPlanesEquipos(){
    return this.http.get(Constantes.URL_API_PLANES+'/planes', {withCredentials: true});
  }
  getPlanesEquipo(id: string){
    return this.http.get(Constantes.URL_API_PLANES+'/planesequipo/'+id, {withCredentials: true});
  }

  postTipoPlan(tipoplan: TipoPlan){
    return this.http.post(Constantes.URL_API_PLANES,tipoplan, {withCredentials: true});
  }
  
  putTipoPlan(){
    return this.http.put(Constantes.URL_API_PLANES+'/plan/'+this.tipoPlanSeleccionado.tipo,this.planSeleccionado, {withCredentials: true});
  }

  deleteTipoPlan(id: string){
    return this.http.delete(Constantes.URL_API_PLANES+'/'+id, {withCredentials: true});
  }
  deletePlan(){
    return this.http.put(Constantes.URL_API_PLANES+'/plan/del/'+this.tipoPlanSeleccionado.tipo,this.planSeleccionado, {withCredentials: true});

  }
}
