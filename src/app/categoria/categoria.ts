export class Categoria {

    constructor(_id = '', correo = '', nombres = '', apellidos = '', password = '', promociones = false) {
        this._id = _id;
        this.correo = correo;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.password = password;
        this.promociones = promociones;
    }
  
    _id: string;
    correo: string;
    nombres: string;
    apellidos: string;
    password: string;
    promociones: boolean;
  }