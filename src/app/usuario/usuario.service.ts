import { Constantes } from '../constantes';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from './usuario';
import { catchError} from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  usuarioSeleccionado : Usuario;
  usuarios : Usuario[];

  constructor(public http : HttpClient) {
    this.usuarioSeleccionado = new Usuario();
  }

  /**
   * Método para guardar los datos de un usuario
   * @param usuario 
   */
  postUsuario(usuario: Usuario): Observable<any> {
    return this.http.post<Usuario>(Constantes.URL_API_USUARIO, usuario, {withCredentials: true}).pipe(
      catchError(this.handleError<Usuario>('postUsuario'))
    );
  }

  /**
   * Método que obtiene toda la lista de usuarios
   */
  getUsuarios() : Observable<Usuario[]> {
    return this.http.get<Usuario[]>(Constantes.URL_API_USUARIO, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getUsuarios',[]))
      );
  }

  /**
   * Método para actualizar los datos de un cliente
   * @param usuario : datos del cliente
   */
  putUsuario(usuario: Usuario) {
    return this.http.put(Constantes.URL_API_USUARIO + `/${usuario._id}`, usuario, {withCredentials: true}).pipe(
      catchError(this.handleError<any>('putUsuario'))
    );
  }

  /**
   * 
   * @param cliente 
   */
  listarusuario(cliente:string){
    return this.http.get(Constantes.URL_API_USUARIO+'/user/'+cliente);
  }

  recuperardoccliente(id:string){
    return this.http.get(Constantes.URL_API_USUARIO+'/clien/doc/'+id);
  }

  /**
   * Manejador de métodos
   * @param operation 
   * @param result 
   */
  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
