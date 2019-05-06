import { Component, OnInit } from '@angular/core';
import { ArchivosService } from './archivos.service';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css']
})
export class ArchivosComponent implements OnInit {

  constructor(public http: HttpClient, 
              public archivosService: ArchivosService,) { }

  ngOnInit() {
    this.getFiles();
  }

  recibido: any;

  getFiles(){
    var ruta = {
      ruta: "/tmp"
    }
    console.log("enviando peticion");
    this.archivosService.getImagenes(ruta).subscribe(res=>{
     console.log(res);
    });
  }

}
