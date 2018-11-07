import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

/*export class Usuario {
  constructor(usuario = '', password = '') {
      this.usuario = usuario;
      this.password = password;
  }
  usuario : string;
  password : string;
}*/

export class LoginService {

  /*private usuario : Usuario;

  readonly URL_API = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) { 
    this.usuario = new Usuario();
  }

  login(user : Usuario){
    return this.http.post(this.URL_API+ 'adminLogin', user);
  }*/
}
