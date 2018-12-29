export class Plan {

    constructor(nombreplan = '', descripcion='') {
        this.nombreplan = nombreplan;
        this.descripcion = descripcion;
    }
  
    nombreplan: string;
    descripcion: string;
  }