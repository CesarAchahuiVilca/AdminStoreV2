export class Marca {
    constructor(_id=null,idMarca='',nombre='',descripcion='', imagen = ''){
        this._id=_id;
        this.idMarca=idMarca;
        this.nombre=nombre;
        this.imagen=imagen;
        this.descripcion=descripcion;
    }

    
    _id:string;
    idMarca:string;
    nombre:string;
    descripcion:string;
    imagen:string;
}
