export class Region {
  
  constructor(_id = '', departamento = '', provincias = []){
    this._id = _id;
    this.departamento = departamento;
    this.provincias = provincias;
  }

  _id: string;
  departamento : string;
  provincias : Provincia[];

}
export class Provincia {

  constructor(provincia = '', distritos = []){
    this.provincia = provincia;
    this.distritos = distritos;
  }

  provincia : string;
  distritos : string[];
}