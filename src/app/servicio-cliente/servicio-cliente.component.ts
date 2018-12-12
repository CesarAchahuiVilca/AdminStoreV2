import { Component, OnInit } from '@angular/core';
import { ServicioClienteService} from './servicio-cliente.service'
import { MensajeChat} from './mensaje-chat';
import { Usuario } from '../usuario/usuario';

@Component({
  selector: 'app-servicio-cliente',
  templateUrl: './servicio-cliente.component.html',
  styleUrls: ['./servicio-cliente.component.css']
})
export class ServicioClienteComponent implements OnInit {

  constructor(private servicioClienteService: ServicioClienteService) { }

  listaMensajesChat: MensajeChat[] = new Array();

  ngOnInit() {

    // Cuando alguien i tenta iniciar conversacion
    this.servicioClienteService.iniciarChat()    
    .subscribe(res=>{
      var cliente = res as Usuario;
      console.log("se conecto "+cliente.nombres);
      this.servicioClienteService.clienteSeleccionado = res as Usuario;
      console.log(this.servicioClienteService.clienteSeleccionado);
    });

    //Al eibir nuevos mensajes
    this.servicioClienteService.nuevoMensaje()
    .subscribe(res=>{
      var mensaje = res as MensajeChat;
      this.agregarMensaje(mensaje);
      console.log(mensaje);

    });
  }
  verificarMensaje(event){
    if(event.code=="Enter" && !event.shiftKey){
      var inputmensaje = document.getElementById("contenidomensaje") as HTMLInputElement;
      if(inputmensaje.value != ""){
        var mensaje = new MensajeChat("admin",this.servicioClienteService.clienteSeleccionado.correo,inputmensaje.value,"","");
        inputmensaje.value = "";
        this.enviarMensaje(mensaje);
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
  MoverScroll() {
    //console.log("termino de renderizar los mensajes ....");
    var contenedorchat = document.getElementById("chat-principal") as HTMLDivElement;
    contenedorchat.scrollTop =contenedorchat.scrollHeight;
  }

} 
