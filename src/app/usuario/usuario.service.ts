import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarioSeleccionado : Usuario;
  usuarios : Usuario[];
  readonly URL_API = 'http://localhost:3000/api/usuarios';

  constructor(private http : HttpClient) {
    this.usuarioSeleccionado = new Usuario();
  }

  postUsuario(usuario: Usuario) {
    return this.http.post(this.URL_API, usuario);
  }

  getUsuarios() {
    return this.http.get(this.URL_API);
  }

  putUsuario(usuario: Usuario) {
    return this.http.put(this.URL_API + `/${usuario._id}`, usuario);
  }

  deleteUsuario(_id: string) {
    return this.http.delete(this.URL_API + `/${_id}`);
  }
}
