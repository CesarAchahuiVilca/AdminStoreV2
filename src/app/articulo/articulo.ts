import { CaracteristicaItem} from './caracteristica'
export class Articulo {

    constructor(idarticulo = null, titulo = '', categoria = '',marca='',cantidad=0, precio = 0, especaficaciones = [], caracteristicas= [], imagenes=[], descripcion='', garantias=[]) {
        this.idarticulo = idarticulo;
        this.titulo = titulo;
        this.precio = precio;
        this.categoria = categoria;
        this.precio = precio;
        this.especificaciones= especaficaciones;
        this.caracteristicas = caracteristicas;
        this.imagenes = imagenes;
        this.descripcion = descripcion;
        this.garantias = garantias;

    }
  
    idarticulo: string;
    titulo: string;
    categoria: string;
    marca: string;
    cantidad: Number;
    precio: Number;
    especificaciones: string[];
    caracteristicas:CaracteristicaItem[];
    imagenes: string[];
    descripcion: string;
    garantias: string[];
  }