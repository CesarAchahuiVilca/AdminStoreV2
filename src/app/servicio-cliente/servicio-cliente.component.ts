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
  migas             = [new Miga('Servicio al Cliente', '/servicio-cliente')];
  listaMensajesChat : MensajeChat[] = new Array();
  ocultarBotonChat  : boolean       = true;
  ocultarEnviarMensaje : boolean    = true;

  constructor(public servicioClienteService: ServicioClienteService) { }

  ngOnInit() {
    this.servicioClienteService.obtenerConversaciones().subscribe( res => {
      var jres = JSON.parse(JSON.stringify(res));
      if (jres.status){
        this.servicioClienteService.conversaciones = jres.data as Conversacion[];
      }
    });
    // Cuando alguien intenta iniciar conversacion
    this.servicioClienteService.iniciarChat().subscribe( res => {
      this.servicioClienteService.conversaciones.push(res as Conversacion);
    });
    //Al recibir nuevos mensajes
    this.servicioClienteService.nuevoMensaje().subscribe(res=>{
      var mensaje = res as MensajeChat;
      this.agregarMensaje(mensaje);
    });
  }

  verificarMensaje(event){
    if(event.code=="Enter" && !event.shiftKey){
      var inputmensaje = document.getElementById("contenidomensaje") as HTMLInputElement;
      if(inputmensaje.value != ""){
        var mensaje = new MensajeChat(this.servicioClienteService.chatSeleccionado._id, inputmensaje.value, "admin", this.servicioClienteService.chatSeleccionado.email);
        this.enviarMensaje(mensaje);
        inputmensaje.value = "";
      }
    }
  }

  agregarMensaje(mensaje: MensajeChat){
    this.listaMensajesChat.push(mensaje);
  }

  enviarMensaje(mensaje: MensajeChat){
    this.servicioClienteService.enviarMensaje(mensaje);
    this.agregarMensaje(mensaje);
  }

  mostrarMensajes(conversacion : Conversacion){
    this.ocultarBotonChat = false;
    this.servicioClienteService.chatSeleccionado = conversacion;
    this.servicioClienteService.obtenerMensajes(conversacion._id).subscribe( res => {
      var jres = JSON.parse(JSON.stringify(res));
      if( jres.status){
        this.listaMensajesChat = jres.data as MensajeChat[];
      }
    });
  }

  MoverScroll(chatPrincipal: HTMLDivElement) {
    chatPrincipal.scrollTop = chatPrincipal.scrollHeight;
  }

  unirseChat(){
    const data = {
      usuario : 'admin'
    };
    this.servicioClienteService.chatSeleccionado.unir = true;
    this.servicioClienteService.unirseChat(data);
  }
} 
