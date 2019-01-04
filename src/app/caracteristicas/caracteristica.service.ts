import { Constantes } from '../constantes';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Caracteristica } from './caracteristica';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class CaracteristicaService {

  caracteristicaSelected: Caracteristica;
  caracteristicas: Caracteristica[];
  readonly URL_API = Constantes.URL_API_CARACTERISTICA;

  constructor(private http: HttpClient) {
    this.caracteristicaSelected = new Caracteristica();
   }

   postCaracteristica(caracteristica: Caracteristica): Observable<Caracteristica> {
     return this.http.post<Caracteristica>(this.URL_API, caracteristica, {withCredentials: true}).pipe(
       catchError(this.handleError<Caracteristica>('postUsuario'))
     );
   }

   getCaracteristicas() : Observable<Caracteristica[]> {
     return this.http.get<Caracteristica[]>(this.URL_API).pipe(
       catchError(this.handleError('getCaracteristicas',[]))
     );
   }

   putCaracteristica(caracteristica: Caracteristica): Observable<any> {
     return this.http.put(this.URL_API + `/${caracteristica._id}`,caracteristica, {withCredentials: true}).pipe(
       catchError(this.handleError<any>('putUsuario'))
     );
   }

   deleteCaracteristica(caracteristica: Caracteristica): Observable<Caracteristica> {
     return this.http.delete<Caracteristica>(this.URL_API + `/${caracteristica._id}`, {withCredentials: true}).pipe(
       catchError(this.handleError<Caracteristica>('deleteCaracteristica'))
     );
   }

   private handleError<T> (operation = 'operation', result?: T){
     return (error: any): Observable<T> => {
       console.error(error);
       return of(result as T)
     };
   }
}