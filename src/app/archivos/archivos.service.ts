import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Constantes} from '../constantes'

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  constructor(public http: HttpClient) { }
  getImagenes(archivos){
    return this.http.put(Constantes.URL_API_IMAGEN+'/files',archivos, {withCredentials: true});
  }
}
