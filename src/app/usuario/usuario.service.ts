import { Constantes } from '../constantes';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';
import { catchError} from 'rxjs/operators';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  usuarioSeleccionado : Usuario;
  usuarios : Usuario[];
  readonly URL_API = Constantes.URL_API_USUARIO;

  constructor(private http : HttpClient) {
    this.usuarioSeleccionado = new Usuario();
  }

  postUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.URL_API, usuario, {withCredentials: true}).pipe(
      catchError(this.handleError<Usuario>('postUsuario'))
    );
  }

  getUsuarios() : Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.URL_API, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getUsuarios',[]))
      );
  }

  putUsuario(usuario: Usuario) {
    return this.http.put(this.URL_API + `/${usuario._id}`, usuario, {withCredentials: true}).pipe(
      catchError(this.handleError<any>('putUsuario'))
    );
  }
  listarusuario(cliente:string){
    return this.http.get(this.URL_API+'/user/'+cliente);
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
