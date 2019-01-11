import { Component, OnInit } from '@angular/core';
import { ServicioClienteService} from './servicio-cliente.service'
import { MensajeChat} from './mensaje-chat';
import { Usuario } from '../usuario/usuario';
import { Miga } from '../miga';
import { Conversacion } from './conversacion';

@Component({
  selector: 'app-servicio-cliente',
  templateUrl: './servicio-cliente.component.html',
  styleUrls: ['./servicio-cliente.component.css']
})
export class ServicioClienteComponent implements OnInit {
  migas = [new Miga('Servicio al Cliente', '/servicio-cliente')];

  constructor(public servicioClienteService: ServicioClienteService) { }

  listaMensajesChat: MensajeChat[] = new Array();

  ngOnInit() {
    this.servicioClienteService.obtenerConversaciones().subscribe( res => {
      var jres = JSON.parse(JSON.stringify(res));
      if (jres.status){
        this.servicioClienteService.conversaciones = jres.data as Conversacion[];
      }
    });
    // Cuando alguien intenta iniciar conversacion
    this.servicioClienteService.iniciarChat().subscribe( res => {
      //var cliente = res as Usuario;
      this.servicioClienteService.conversaciones.push(res as Conversacion);
      //this.servicioClienteService.clienteSeleccionado = res as Usuario;
      //this.servicioClienteService.clientes.push(res as Usuario);
      //console.log(this.servicioClienteService.clienteSeleccionado);
    });
    //Al recibir nuevos mensajes
    this.servicioClienteService.nuevoMensaje().subscribe(res=>{
      var mensaje = res as MensajeChat;
      this.agregarMensaje(mensaje);
      console.log(mensaje);
    });
  }

  verificarMensaje(event){
    if(event.code=="Enter" && !event.shiftKey){
      var inputmensaje = document.getElementById("contenidomensaje") as HTMLInputElement;
      if(inputmensaje.value != ""){
        var mensaje = new MensajeChat(this.servicioClienteService.chatSeleccionado._id, inputmensaje.value, "admin",this.servicioClienteService.chatSeleccionado.email);
        this.enviarMensaje(mensaje);
        inputmensaje.value = "";
      }
    }
  }

  agregarMensaje(mensaje: MensajeChat){
    this.listaMensajesChat.push(mensaje);
    //console.log(this.listaMensajesChat);
  }

  enviarMensaje(mensaje: MensajeChat){
    this.servicioClienteService.enviarMensaje(mensaje);
    this.agregarMensaje(mensaje);
  }

  mostrarMensajes(conversacion : Conversacion){
    this.servicioClienteService.chatSeleccionado = conversacion;
    this.servicioClienteService.obtenerMensajes(conversacion._id).subscribe( res => {
      var jres = JSON.parse(JSON.stringify(res));
      if( jres.status){
        this.listaMensajesChat = jres.data as MensajeChat[];
      }
    });
  }

  MoverScroll() {
    //console.log("termino de renderizar los mensajes ....");
    var contenedorchat = document.getElementById("chat-principal") as HTMLDivElement;
    contenedorchat.scrollTop =contenedorchat.scrollHeight;
  }

} 
