import { Component, OnInit } from '@angular/core';
import{ CategoriaService} from './categoria.service';
import {HttpClient, HttpEventType} from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Categoria } from './categoria';
import { variable } from '@angular/compiler/src/output/output_ast';
import { formDirectiveProvider } from '@angular/forms/src/directives/reactive_directives/form_group_directive';

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
  constructor( private http: HttpClient, private categoriaService: CategoriaService) { }
  nextID : Number = 0 ;
  vista: string = "1";

  IDCategoriaSelecionada: string = "root";
  
  breadcrumb_categorias: Categoria[] = new Array();
  todasCategorias:Categoria[];
  ngOnInit() {
    
    var  imagen = document.getElementById("imagen-select") as HTMLImageElement;
    imagen.src ="//placehold.it/600x300?text=Ninguna Imagen Seleccionada";
    var cat = new Categoria();
    cat.nombre = "Categorias";
    cat._id = "root";
    this.mostrarSubCategorias(cat);
    this.getCategorias();
   
  }
 /* cambiarvista(form?: NgForm){
    this.limpiarform(form);
    if(this.vista == "1"){
      this.vista ="2";
      document.getElementById("contenido_lista_categorias").hidden = true;
      document.getElementById("contenido_agregar_categoria").hidden = false;
      var botones = document.getElementById("btnOpcion") as HTMLButtonElement;
      botones.innerHTML='<i class="fa fa-angle-left" ></i> Regresar';
    }else{
      this.vista ="1";
      document.getElementById("contenido_lista_categorias").hidden = false;
      document.getElementById("contenido_agregar_categoria").hidden = true;
      var botones = document.getElementById("btnOpcion") as HTMLButtonElement;
      botones.innerHTML='<i class="fa fa-plus" ></i> Agregar Categoria';

    }

  }*/
  
  limpiarform(form?: NgForm){
    if(form){
      this.categoriaService.categoriaSeleccionada = new Categoria();
      form.reset();      
      var  imagen = document.getElementById("imagen-select") as HTMLImageElement;
      imagen.src ="//placehold.it/600x300?text=Ninguna Imagen Seleccionada";
      var progreso = document.getElementById("progreso") as HTMLDivElement;
      progreso.innerHTML = "";
      progreso.style.width = "0%";
    }
  }
  clearProgress(){
    var progreso = document.getElementById("progreso") as HTMLDivElement;
    progreso.style.width="0%";
    progreso.style.backgroundColor = "orange";
    var inputfile = document.getElementById("nombrearchivo") as HTMLDivElement;
    inputfile.style.display = "block";
    progreso.innerHTML = "";

  }

  guardarCategoria(form?: NgForm){
    if(form.value._id){
      this.categoriaService.putCategoria(form.value)
      .subscribe(res=>{
        this.limpiarform(form);
        this.irASubCategoria(this.breadcrumb_categorias[this.breadcrumb_categorias.length-1]);
        console.log(res);
      });
      
    }else{
    
    const cat = {
      nombre : form.value.nombre,
      descripcion: form.value.descripcion,
      imagen: form.value.imagen,
      padre: form.value.padre

    }

    this.categoriaService.postCategoria(cat as Categoria)
    .subscribe(res=>{
      this.limpiarform(form);
      this.irASubCategoria(this.breadcrumb_categorias[this.breadcrumb_categorias.length-1]);
      console.log(res);
      
    });
  }
  }
  
  editarCategoria(categoria: Categoria){
    
    this.categoriaService.categoriaSeleccionada = categoria;
    var  imagen = document.getElementById("imagen-select") as HTMLImageElement;
    imagen.src =this.URL_IMAGES+"/tmp/"+categoria.imagen;
    var imagenInput  = document.getElementById("imagen") as HTMLInputElement;
    var inputfile = document.getElementById("nombrearchivo") as HTMLLabelElement;
    inputfile.innerHTML = this.categoriaService.categoriaSeleccionada.imagen;
    
    

  }

  eliminarCategoria(idCategoria){
    this.categoriaService.deleteCategoria(idCategoria)
    .subscribe(res=>{
      this.irASubCategoria(this.breadcrumb_categorias[this.breadcrumb_categorias.length-1]);
      console.log(res);
    });
    console.log(idCategoria);

  }

  getCategorias(){
    this.categoriaService.getCategorias()
    .subscribe(res=>{
      this.todasCategorias = res as Categoria[];
      
      
    });
  }

  mostrarSubCategorias(categoria: Categoria){

    

    this.breadcrumb_categorias.push(categoria);
    
    this.categoriaService.getSubCategorias(categoria._id)
    .subscribe(res=>{
      this.categoriaService.categorias = res as Categoria[];
      if(this.categoriaService.categorias.length == 0){
         document.getElementById("mensaje").innerHTML = "NO SE ENCONTRARON DATOS.";
      }else{
        document.getElementById("mensaje").innerHTML = "";
      }
      
    });

    
  }
  irASubCategoria(categoria: Categoria){
    console.log("");
    while(this.breadcrumb_categorias[this.breadcrumb_categorias.length-1].nombre != categoria.nombre){
      this.breadcrumb_categorias.pop();
    }
    this.breadcrumb_categorias.pop();
    
    this.mostrarSubCategorias(categoria);
  }

  onFileSelected(event){

    var inputfile = document.getElementById("nombrearchivo") as HTMLDivElement;
    var file = document.getElementById("archivo") as HTMLInputElement;
    inputfile.innerHTML = file.value;
    this.selectedFile  = <File> event.target.files[0];

    //console.log(event);
  }
  onUpload(evento){
    evento.preventDefault()
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
          progreso.innerHTML = "Subiendo "+ Math.round(event.loaded/event.total*100)+" %";
          inputfile.style.display="none";
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
            imagen.src =this.URL_IMAGES+"/tmp/"+this.selectedFile.name;
            progreso.style.backgroundColor = "green";
            progreso.innerHTML = "Completado.";          
            
            this.categoriaService.categoriaSeleccionada.imagen = this.selectedFile.name;


          }
        }
      }
    );
  }
  

}
