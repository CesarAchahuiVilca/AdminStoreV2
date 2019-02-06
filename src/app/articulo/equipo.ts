export class Equipo{
    constructor(idequipo='', descripcion='', cantidad=0,color='',detalle='',imagen=''){
        this.idequipo = idequipo;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        this.color = color;
        this.detalle = detalle;
        this.imagen = imagen;
    }
    idequipo: string;
    descripcion: string;
    cantidad: Number;
    color: string;
    detalle: string;
    imagen: string;
    codigocolor: string;
}