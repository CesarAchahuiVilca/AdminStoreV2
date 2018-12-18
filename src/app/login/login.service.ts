import { Constantes } from '../constantes';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  public usuarioSeleccionado : Usuario;

  readonly URL_API = Constantes.URL_API_USUARIO;

  constructor(private http: HttpClient) { 
    this.usuarioSeleccionado = new Usuario();
  }

  login(user : Usuario){
    return this.http.post(this.URL_API+ '/adminLogin', user);
  }
}
