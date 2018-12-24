import { Constantes } from '../constantes';
import { Component, OnInit } from '@angular/core';
import { CategoriaService } from './categoria.service';
import { CaracteristicaService } from '../caracteristicas/caracteristica.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Categoria } from './categoria';
import { Caracteristica }  from '../caracteristicas/caracteristica';
import { variable } from '@angular/compiler/src/output/output_ast';
import { formDirectiveProvider } from '@angular/forms/src/directives/reactive_directives/form_group_directive';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
  providers: [CategoriaService]
})
export class CategoriaComponent implements OnInit {

  readonly URL_API        = Constantes.URL_API_IMAGEN + '/subir';
  readonly URL_IMAGES     = Constantes.URL + '/imagenes';
  selectedFile            : File = null;
  nextID                  : Number = 0 ;
  vista                   : string = "1";
  IDCategoriaSelecionada  : string = "root";
  breadcrumb_categorias   : Categoria[] = new Array();
  todasCategorias         : Categoria[];
  caracteristicas         : Caracteristica[];
  mostrarCarga            : boolean = false;

  constructor( 
    private http: HttpClient, 
    private categoriaService: CategoriaService,
    private caracteristicasService: CaracteristicaService
  ) { }

  ngOnInit() {
    var  imagen = document.getElementById("imagen-select") as HTMLImageElement;
    imagen.src ="//placehold.it/600x300?text=Ninguna Imagen Seleccionada";
    var cat = new Categoria();
    cat.nombre = "Categorias";
    cat._id = "root";
    cat.padre="root";
    this.mostrarSubCategorias(cat);
    this.getCategorias();
    this.getCaracteristicas();
    this.categoriaService.categoriaSeleccionada.padre  = "root";    
  }
  
  limpiarform(form?: NgForm){    
    if(form){      
      this.categoriaService.categoriaSeleccionada = new Categoria();   
     this.categoriaService.categoriaSeleccionada.padre  = this.breadcrumb_categorias[this.breadcrumb_categorias.length-1]._id;
      //console.log("padre es: "+this.categoriaService.categoriaSeleccionada.padre);
      document.getElementById("titulomodal").innerHTML='<i class="fa fa-plus"></i> Agregar Categoria';
      var  imagen = document.getElementById("imagen-select") as HTMLImageElement;
      imagen.src ="//placehold.it/600x300?text=Ninguna Imagen Seleccionada";
      var progreso = document.getElementById("progreso") as HTMLDivElement;
      progreso.innerHTML = "";
      progreso.style.width = "0%";   
      this.limpiarChecks();     
    }
  }

  clearProgress(){
    var progreso = document.getElementById("progreso") as HTMLDivElement;
    progreso.style.width="0%";
    progreso.style.backgroundColor = "orange";
    var inputfile = document.getElementById("nombrearchivo") as HTMLDivElement;
    inputfile.style.display = "block";
    progreso.innerHTML = "";
    var archivoinput = document.getElementById("archivo") as HTMLInputElement;
    archivoinput.click();
  }

  mostrarmensaje(mensaje: string, estado: string){
    if(estado == "0"){
      var labelmensaje =  document.getElementById("resultadoerror") as HTMLLabelElement;
      labelmensaje.innerHTML = mensaje;      
      document.getElementById("btnmensajeerror").click();
    }else{
      var labelmensaje =  document.getElementById("resultadoexito") as HTMLLabelElement;
      labelmensaje.innerHTML = mensaje;
      document.getElementById("btnmensajeexito").click();
    }
  }

  guardarCategoria(form?: NgForm){
    //console.log(this.categoriaService.categoriaSeleccionada);
    var btncerrarmodal = document.getElementById("btnCerrarModal");
    if(form.value._id){
      this.categoriaService.putCategoria(this.categoriaService.categoriaSeleccionada)
      .subscribe(res=>{
        this.irASubCategoria(this.breadcrumb_categorias[this.breadcrumb_categorias.length-1]);
        var respuesta = JSON.parse(JSON.stringify(res));
        if(respuesta.estado == "0"){    
          console.log("OCURRIO UN ERROR ESTADO 0");
          this.mostrarmensaje(respuesta.mensaje, respuesta.estado);
        }else{
          this.limpiarform(form);
          btncerrarmodal.click();
          this.getCategorias();
          console.log("TODO ESTA CORRECTO");
          this.mostrarmensaje(respuesta.mensaje, respuesta.estado);
        }           
      }); 
    }else{
      this.categoriaService.postCategoria(this.categoriaService.categoriaSeleccionada)
      .subscribe(res=>{ 
        this.irASubCategoria(this.breadcrumb_categorias[this.breadcrumb_categorias.length-1]);
        var respuesta = JSON.parse(JSON.stringify(res));
        if(respuesta.estado == "0"){   
        //console.log("OCURRIO UN ERROR ESTADO 0:"+cat.nombre+" - "+cat.padre);
          this.mostrarmensaje(respuesta.mensaje, respuesta.estado);
        }else{
          this.limpiarform(form);
          btncerrarmodal.click();
          this.getCategorias();
          console.log("TODO ESTA CORRECTO");
          this.mostrarmensaje(respuesta.mensaje, respuesta.estado);
        }          
      });
    }
  }
  
  editarCategoria(categoria: Categoria){  
    this.categoriaService.categoriaSeleccionada = categoria;
    //console.log(categoria);
    var  imagen = document.getElementById("imagen-select") as HTMLImageElement;
    imagen.src =this.URL_IMAGES+"/tmp/"+categoria.imagen;
    //var imagenInput  = document.getElementById("imagen") as HTMLInputElement;
    var inputfile = document.getElementById("nombrearchivo") as HTMLLabelElement;
    inputfile.innerHTML = this.categoriaService.categoriaSeleccionada.imagen;
    document.getElementById("titulomodal").innerHTML='<i class="fa fa-edit"></i> Editar Categoria: '+categoria.nombre;   
    this.limpiarChecks();
    //console.log(this.caracteristicas);
    for(var i = 0; i < this.categoriaService.categoriaSeleccionada.caracteristicas.length; i++){
      var j = 0;
      while(this.categoriaService.categoriaSeleccionada.caracteristicas[i]._id != this.caracteristicas[j]._id)
      {
        j = j + 1;
      }
      var check = document.getElementById(this.caracteristicas[j].nombre) as HTMLInputElement;
      check.checked = true;
    }
  }

  eliminarCategoria(idCategoria){
    this.categoriaService.deleteCategoria(idCategoria)
    .subscribe(res=>{
      this.irASubCategoria(this.breadcrumb_categorias[this.breadcrumb_categorias.length-1]);
      //console.log(res);
      var respuesta = JSON.parse(JSON.stringify(res));
      this.mostrarmensaje(respuesta.mensaje, respuesta.estado);
      this.getCategorias();
    });
    //console.log(idCategoria);
  }

  getCategorias(){
    this.mostrarCarga = true;
    this.categoriaService.getCategorias()
    .subscribe(res=>{
      this.todasCategorias = res as Categoria[];  
      this.mostrarCarga = false;
    });
  }

  getCaracteristicas(){
    this.caracteristicasService.getCaracteristicas().subscribe(res =>{
      this.caracteristicas = res as Caracteristica[];
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
    //console.log("");
    while(this.breadcrumb_categorias[this.breadcrumb_categorias.length-1].nombre != categoria.nombre){
      this.breadcrumb_categorias.pop();
    }
    this.breadcrumb_categorias.pop();   
    this.mostrarSubCategorias(categoria);
    this.limpiarChecks();
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
            //console.log("termino subir la imagen");
            //console.log("Comprimiendo imagen");
            progreso.innerHTML = "Comprimiendo Imagen....";
            inputfile.innerHTML = "";
          }
        
        }else{
          if(event.type === HttpEventType.Response){
            //console.log(event.body);
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

  checkCaracteristica(caracteristica : Caracteristica){
    //console.log(this.categoriaService.categoriaSeleccionada);
    var checkButton = document.getElementById(caracteristica.nombre) as HTMLInputElement;
    if (checkButton.checked){
      this.categoriaService.categoriaSeleccionada.caracteristicas.push(caracteristica);
    }else {
      var i = 0;
      while(this.categoriaService.categoriaSeleccionada.caracteristicas[i]._id != caracteristica._id){ i = i + 1;}
      this.categoriaService.categoriaSeleccionada.caracteristicas.splice(i,1);
    }
    //console.log(this.categoriaService.categoriaSeleccionada.caracteristicas);
  }

  limpiarChecks(){
    for(var i = 0; i < this.caracteristicas.length; i++){
      var check = document.getElementById(this.caracteristicas[i].nombre) as HTMLInputElement;
      check.checked = false;
    }
  }
}
