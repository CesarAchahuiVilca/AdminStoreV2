import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Region } from './region';
import { Provincia } from './provincia';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  departamentoSelected : Region;
  provinciaSelected : Provincia;
  distritoSelected : string;
  regiones : Region[];
  provincias : Provincia[];
  distritos : string[];

  readonly URL_API = 'http://localhost:3000/api/re';

  constructor(private http : HttpClient) {
    this.departamentoSelected = new Region();
    this.provinciaSelected = new Provincia();
  }

  postRegion(region : Region){
    return this.http.post(this.URL_API, region);
  }

  getRegiones(){
    return this.http.get(this.URL_API);
  }

  putRegion(region: Region){
    return this.http.put(this.URL_API + `/${region._id}`, region);
  }

  deleteRegion(_id: string) {
    return this.http.delete(this.URL_API + `/${_id}`);
  }
}
