export class Categoria {

    constructor(_id = '', nombre = '', descripcion = '', padre = '', imagen = '') {
        this._id = _id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.padre = padre;
        this.imagen = imagen;
    }
  
    _id: string;
    nombre: string;
    descripcion: string;
    padre: string;
    imagen: string;
  }