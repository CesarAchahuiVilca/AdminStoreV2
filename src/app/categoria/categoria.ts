import {Caracteristica} from '../caracteristicas/caracteristica';
export class Categoria {

    constructor(_id = null, nombre = '', descripcion = '', padre = '', imagen = '', caracteristicas=[]) {
        this._id = _id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.padre = padre;
        this.imagen = imagen;
        this.caracteristicas = caracteristicas;
    }
  
    _id: string;
    nombre: string;
    descripcion: string;
    padre: string;
    imagen: string;
    caracteristicas: Caracteristica[];
  }