import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private usuarioSeleccionado : Usuario;

  readonly URL_API = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) { 
    this.usuarioSeleccionado = new Usuario();
  }

  login(user : Usuario){
    return this.http.post(this.URL_API+ '/adminLogin', user);
  }
}
