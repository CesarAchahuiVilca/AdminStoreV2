import { Component, OnInit } from '@angular/core';
import{ CategoriaService} from './categoria.service';
import {HttpClient, HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
  providers: [CategoriaService]
})
export class CategoriaComponent implements OnInit {

  readonly URL_API = 'http://localhost:3000/api/imagenes/subir';
  readonly URL_IMAGES = 'http://localhost:3000/imagenes';
  selectedFile: File = null;
  constructor( private http: HttpClient) { }

  ngOnInit() {
  }
  onFileSelected(event){

    var inputfile = document.getElementById("nombrearchivo") as HTMLDivElement;
    var file = document.getElementById("archivo") as HTMLInputElement;
    inputfile.innerHTML = file.value;
    

    this.selectedFile  = <File> event.target.files[0];

    console.log(event);
  }
  onUpload(){
    var inputfile = document.getElementById("nombrearchivo") as HTMLDivElement;
    var progreso = document.getElementById("progreso") as HTMLDivElement;
    inputfile.innerHTML="";
    const fd = new FormData();
    fd.append('image',this.selectedFile, this.selectedFile.name);
    this.http.post(this.URL_API,fd,{
      reportProgress: true,
      observe: 'events'
    })
    .subscribe(event=>{
        if(event.type === HttpEventType.UploadProgress){
          console.log("Subiendo "+ Math.round(event.loaded/event.total*100)+" %");
          progreso.style.width = Math.round(event.loaded/event.total*100)+"%";
          inputfile.innerHTML = "Subiendo "+ Math.round(event.loaded/event.total*100)+" %";
          if(Math.round(event.loaded/event.total*100) == 100){
            console.log("termino subir la imagen");
            console.log("Comprimiendo imagen");
            progreso.innerHTML = "Comprimiendo Imagen....";
            inputfile.innerHTML = "";
          }
        
        }else{
          if(event.type === HttpEventType.Response){
            console.log(event.body);
            var  imagen = document.getElementById("imagen-select") as HTMLImageElement;
            imagen.src =this.URL_IMAGES+"/compressed/"+this.selectedFile.name;
            progreso.style.backgroundColor = "green";
            progreso.innerHTML = "Completado.";

          }
        }
      }
    );
  }

}
