import { CaracteristicaItem} from './caracteristica';
import { Equipo }  from './equipo';

export class Articulo {

    constructor( _id=null,idarticulo = '', titulo = '',url='', categoria = '',marca='',cantidad=0, idprecio = '', caracteristicas= [], imagenes=[], descripcion='', garantias=[], equipos=[], palabrasclaves='') {
        this.idarticulo = idarticulo;
        this.titulo = titulo;
        this.url = url;
        this.categoria = categoria;
        this.idprecio = idprecio;
        this.caracteristicas = caracteristicas;
        this.imagenes = imagenes;
        this.descripcion = descripcion;
        this.garantias = garantias;
        this.marca = marca;
        this.equipos = equipos;
        this.palabrasclaves = palabrasclaves;
        this.descuento = 0;
    }
  
    _id: string;
    idarticulo: string;
    titulo: string;
    url: string;
    categoria: string;
    marca: string;
    cantidad: Number;
    idprecio:String;
    especificaciones: string[];
    caracteristicas:CaracteristicaItem[];
    imagenes: string[];
    descripcion: string;
    garantias: string[];
    equipos: Equipo[];
    palabrasclaves: string;
    descuento: Number;
  }