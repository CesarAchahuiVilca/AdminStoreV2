export class MensajeChat {

    constructor(usuario = '', destino='',mensaje='',fecha='', hora='') {
        this.usuario=usuario;
        this.mensaje= mensaje;
        this.fecha = fecha;
        this.hora = hora;
        this.destino = destino;
    }
  
    usuario: string;
    destino: string;
    mensaje : string;
    fecha : string;
    hora: string;
  }