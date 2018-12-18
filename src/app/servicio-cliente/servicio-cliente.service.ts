import { Constantes } from '../constantes';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Usuario } from '../usuario/usuario';
@Injectable({
  providedIn: 'root'
})
export class ServicioClienteService {
  private socket  = io('https://latiendadeltiogeorge.herokuapp.com');

  idChat:string = "admin"

  clienteSeleccionado: Usuario = new Usuario();
  usuario: Usuario = new Usuario();
  constructor() { }
  enviarMensaje(data){
    this.socket.emit("chat-admin",data);
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
}
