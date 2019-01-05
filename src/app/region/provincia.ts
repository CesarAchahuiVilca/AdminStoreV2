export class Provincia {

  constructor(_id = '', provincia = '', distritos = []){
    this._id = _id;
    this.provincia = provincia;
    this.distritos = distritos;
  }

  _id : string;
  provincia : string;
  distritos : string[];
}