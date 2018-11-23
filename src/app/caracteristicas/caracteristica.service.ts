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
  readonly URL_API = 'http://localhost:3000/api/caracteristicas';

  constructor(private http: HttpClient) {
    this.caracteristicaSelected = new Caracteristica();
   }

   postCaracteristica(caracteristica: Caracteristica): Observable<Caracteristica> {
     return this.http.post<Caracteristica>(this.URL_API, caracteristica).pipe(
       catchError(this.handleError<Caracteristica>('postUsuario'))
     );
   }

   getCaracteristica() : Observable<Caracteristica[]> {
     return this.http.get<Caracteristica[]>(this.URL_API).pipe(
       catchError(this.handleError('getCaracteristicas',[]))
     );
   }

   putCaracteristica(caracteristica: Caracteristica): Observable<any> {
     return this.http.put(this.URL_API + `/${caracteristica._id}`,caracteristica).pipe(
       catchError(this.handleError<any>('putUsuario'))
     );
   }

   deleteCaracteristica(caracteristica: Caracteristica): Observable<Caracteristica> {
     return this.http.delete<Caracteristica>(this.URL_API + `/${caracteristica._id}`).pipe(
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