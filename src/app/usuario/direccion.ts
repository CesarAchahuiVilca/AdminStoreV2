export class Direccion {

  constructor(_id = '', usuario = '', direccion = '', manzana = '', nroLote = '', depInterior = '', urbanizacion = '', referencia = '', departamento = '', provincia = '', distrito = ''){
    this._id = _id;
    this.usuario = usuario;
    this.direccion = direccion;
    this.manzana = manzana;
    this.nroLote = nroLote;
    this.depInterior = depInterior;
    this.urbanizacion = urbanizacion;
    this.referencia = referencia;
    this.departamente = departamento;
    this.provincia = provincia;
    this.distrito = distrito;
  }

  _id : string;
  usuario : string;
  direccion : string;
  manzana : string;
  nroLote : string;
  depInterior : string;
  urbanizacion : string;
  referencia : string;
  departamente : string;
  provincia : string;
  distrito : string;
}