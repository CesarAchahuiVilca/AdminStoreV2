export class Provincia {

  constructor(provincia = '', distritos = []){
    this.provincia = provincia;
    this.distritos = distritos;
  }

  provincia : string;
  distritos : string[];
}