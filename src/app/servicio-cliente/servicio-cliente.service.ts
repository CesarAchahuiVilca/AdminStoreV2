import { Constantes } from '../constantes';
import { Conversacion } from './conversacion';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Usuario } from '../usuario/usuario';
import { HttpClient } from '@angular/common/http';
import { MensajeChat } from './mensaje-chat';

@Injectable({
  providedIn: 'root'
})

export class ServicioClienteService {
  public socket                   = io(Constantes.URL);
  idChat                : string  = "admin";
  nombreUsuario         : string;
  tipoUsuario           : string;
  idUsuario             : string;
  conversaciones        : Conversacion[] = [];
  chatSeleccionado      : Conversacion;

  constructor(public http: HttpClient) { }

  enviarMensaje(data: MensajeChat){
    this.http.post(Constantes.URL_API_CHAT + '/' + data.conversacionId, data, {withCredentials: true}).subscribe( res =>{
      var jres = JSON.parse(JSON.stringify(res));
      if (jres.status){
        this.socket.emit("chat-admin",jres.data as MensajeChat);
      }
    })
  }

  unirseChat(data: MensajeChat){  
    this.http.put(Constantes.URL_API_CHAT + '/'+ data.conversacionId, {idUsuario: this.idUsuario},{withCredentials: true}).subscribe( res => {
      var jres = JSON.parse(JSON.stringify(res));
      console.log(res);
      if(jres.status){
        this.socket.emit("join-chat", data);
      }
    })
  }

  nuevoMensaje(){
    let observable = new Observable(observer => {
      this.socket.on("admin", (data) => {
        observer.next(data);
      })
      return () => {
        this.socket.disconnect();
      }
   });
   return observable;
  }

  iniciarChat(){
    let observable = new Observable(observer => {
      this.socket.on("init-admin", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    });
    return observable;
  }

  obtenerConversacionesEntre(dia: string, mes: string, anio: string){
    return this.http.get(Constantes.URL_API_CHAT + '/' + dia + '/' + mes + '/' + anio, {withCredentials: true});
  }

  obtenerConversaciones(){
    return this.http.get(Constantes.URL_API_CHAT,{withCredentials: true});
  }

  obtenerMensajes(idConversacion: string){
    return this.http.get(Constantes.URL_API_CHAT + '/' + idConversacion, {withCredentials: true});
  }
}
