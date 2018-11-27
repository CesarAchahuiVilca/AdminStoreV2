export class ArticuloMysql {

    constructor(idArticulo = '', Descripcion = '') {
        this.idArticulo = idArticulo;
        this.Descripcion = Descripcion;
    }
  
    idArticulo: string;
    Descripcion: string;
    Cantidad: Number;
  }