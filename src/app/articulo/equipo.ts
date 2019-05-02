export class Equipo{
    constructor(idequipo='', descripcion='', cantidad=0,color='',detalle='',imagen=''){
        this.idequipo = idequipo;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        this.color = color;
        this.detalle = detalle;
        this.imagen = imagen;
        this.preciocompra = 0;
        this.precioventa = 0;
        this.precioreferencial = 0;
    }
    idequipo: string;
    descripcion: string;
    cantidad: Number;
    color: string;
    detalle: string;
    imagen: string;
    codigocolor: string;
    preciocompra:Number;
    precioventa:Number;
    precioreferencial: Number;
}