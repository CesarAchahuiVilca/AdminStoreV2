import { MarcaMysql } from './marca-mysql';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Constantes} from '../constantes'


@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  marcaselectmysql:MarcaMysql=new MarcaMysql();
  marcaMysql:MarcaMysql[];

  constructor(private http:HttpClient) { 
    this.marcaselectmysql= new MarcaMysql();
  }

  listarmarcamysql(){
    return this.http.get(Constantes.URL_API_MARCA);
  }

}
