export class Direccion {

  constructor(_id = '', usuario = '', direccion = '', referencia = '', departamento = '', provincia = '', distrito = ''){
    this._id = _id;
    this.usuario = usuario;
    this.direccion = direccion;
    this.referencia = referencia;
    this.departamento = departamento;
    this.provincia = provincia;
    this.distrito = distrito;
  }

  _id : string;
  usuario : string;
  direccion : string;
  referencia : string;
  departamento : string;
  provincia : string;
  distrito : string;
}