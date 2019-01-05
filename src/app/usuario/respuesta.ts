export class Respuesta {

  constructor(status = false, msg = '', error = '', data : any) {
    this.status = status;
    this.msg = msg;
    this.error = error;
    this.data = data;
  }

  status  : boolean;
  msg     : string;
  error   : string;
  data    : any;
}