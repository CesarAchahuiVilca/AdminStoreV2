import { Constantes } from './../constantes';
import { HttpClient } from '@angular/common/http';
import { Distribuidormysql } from './distribuidormysql';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DistribuidorService {
  distriselecmysql:Distribuidormysql=new Distribuidormysql();
  distriMysql:Distribuidormysql[];

  constructor(private http:HttpClient) { 
    this.distriselecmysql= new Distribuidormysql();
  }

  listardistrimysql(){
    return this.http.get(Constantes.URL_API_DISTRI);
  }
}
