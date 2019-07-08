import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Miga } from '../miga';
import { Constantes } from '../constantes';

@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.css']
})
export class PreciosComponent implements OnInit {
  readonly URL_API = Constantes.URL_API_PLANES+"/subir";

  mensajeestado = "";
  selectedFile: File = null;
  migas = [new Miga('Precios','/precios')];
  progreso=50;
  modo = 'determinate';
  constructor(private http: HttpClient) { }

  ngOnInit() {
    /*var progreso = document.getElementById("progreso") as HTMLDivElement;
    progreso.style.width = 0+"%";*/
  }

  buscaNuevaArchivo(){
    document.getElementById("excelinput").click();
    document.getElementById("progresosubida").hidden = true;

  }
  cambioArchivo(evento){
    var input = document.getElementById("excelinput") as HTMLInputElement;
    document.getElementById("nombrearchivoexcel").innerHTML = input.value.replace(/C:\\fakepath\\/i, '');
    this.selectedFile = evento.target.files[0];
    console.log(this.selectedFile);
    var progreso = document.getElementById("progreso") as HTMLDivElement;
    progreso.style.width = 0+"%";

  }
  procesarExcel(evento){
    document.getElementById("progresosubida").hidden = false;
    evento.preventDefault();
    var progreso = document.getElementById("progreso") as HTMLDivElement;
    const fd = new FormData();
    fd.append('excel',this.selectedFile, this.selectedFile.name);
    this.http.post(this.URL_API,fd,{
      reportProgress: true,
      observe: 'events'
    })
    .subscribe(event=>{
        if(event.type === HttpEventType.UploadProgress){
          console.log("Subiendo "+ Math.round(event.loaded/event.total*100)+" %");
          progreso.style.width = Math.round(event.loaded/event.total*100)+"%";
          this.mensajeestado = "Subiendo "+ Math.round(event.loaded/event.total*100)+" %";
          
          if(Math.round(event.loaded/event.total*100) == 100){
            progreso.style.backgroundColor = "orange";
            this.mensajeestado = "Actualizando precios.....";
          }
        
        }else{
          if(event.type === HttpEventType.Response){
            //console.log(event.body);
            progreso.style.backgroundColor = "green";
            this.mensajeestado = "Completado";
             window.setTimeout(()=>{
                this.mostrarListaPlanes(event.body);
             },500);
          }
        }
      }
    );

  }
  mostrarListaPlanes(res){
    console.log(res);

  }
}
