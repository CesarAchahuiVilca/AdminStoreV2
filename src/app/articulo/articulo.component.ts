import { Component, OnInit } from '@angular/core';
import{ ArticuloService} from './articulo.service';
import {HttpClient, HttpEventType} from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Articulo } from './articulo';
import { ArticuloMysql } from './articuloMysql';
import { CaracteristicaItem } from './caracteristica';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject, identity } from 'rxjs';
import { CategoriaService } from '../categoria/categoria.service';
import { CaracteristicaService } from '../caracteristicas/caracteristica.service';
import { Categoria } from '../categoria/categoria';
import { Caracteristica }  from '../caracteristicas/caracteristica';
import { CategoriaComponent } from '../categoria/categoria.component'
import { MarcaService} from '../marcadistri/marca.service';
import { Marca} from '../marcadistri/marca';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css'],
  providers: [ArticuloService]
})
export class ArticuloComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTriggers: Subject<any> = new Subject();
  flag: boolean = true;
  itemsDatosGenerales: [number, string][] = new Array();
  contador_datos_generales = 1;
  itemsCaracteristicas: Number[] = new Array();
  contador_caracteristicas = 1;
  itemsImagenes: string[] = new Array();
  contador_imagenes = 1;
  itemseleccionado: string = "";
  readonly URL_API = 'http://localhost:3000/api/imagenes/subir';
  readonly URL_IMAGES = 'http://localhost:3000/imagenes';
  selectedFile: File = null;
  vista: string = "1";
  //CATEGORIAS
  listacategorias: Categoria[];

  listamarcas: Marca[];
  //CARACTERISRTICAS
  listacaracteristicas: Caracteristica[];
  listacaracteristicasarticulo : CaracteristicaItem[];
  //lista imagenes
  listaimagenes: string[];
  //contenido del editor
  contenidoEditor: string = "<p></p>";
  // lista de imagenes seleccionadas
  imagenesSeleccionadas: string[] = new Array();

   // nombre imagen para el editor
   imageneditorseleccionada: string="";

  quillConfig={
    toolbar: {
      container: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],        
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction        
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],        
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],        
            ['clean'],                                         // remove formatting button        
            ['link', 'image', 'video']                         // link and image, video
         ],
         handlers: {'image': this.buscaNuevaImagenEditor}
       }
  };

  constructor(private http: HttpClient, 
              private articuloService: ArticuloService,
              private categoriaService: CategoriaService,
              private caracteristicaService: CaracteristicaService,
              private marcaService: MarcaService) { }

  ngOnInit() {
    this.itemsDatosGenerales.push([1,""]);
    this.itemsCaracteristicas.push(1);
    this.itemsImagenes.push("imagen-1");
    
    this.listacaracteristicas = new Array();

    this.getArticulosMysql();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ elementos",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }      
    };
   // document.getElementById("listaarticulos").hidden = false;
    document.getElementById("formulario-articulo").hidden = true;
    document.getElementById("btnOpcion").hidden=true;
    //Obtener categorias 
    this.getCategorias();    
    this.getMarcas();
    console.log(this.listamarcas);
  }

  editorInstance;
  created(editorInstance) {
   this.editorInstance = editorInstance;
  }
  newHandlerImage(){
    console.log(this.contenidoEditor);
  }

  limpiarFormulario(){
    this.articuloService.articuloSeleccionado = new Articulo();
    this.imagenesSeleccionadas = new Array();
    this.listacaracteristicas = new Array();
    this.itemsDatosGenerales = new Array();
    this.contenidoEditor = "<p></p>";
    this.listacaracteristicasarticulo = new Array();
  }


  cambiarvista(articulo?: ArticuloMysql, form?: NgForm){
    //this.limpiarform(form);
    if(this.vista == "1"){
      this.vista ="2";
      document.getElementById("listaarticulos").hidden = true;
      document.getElementById("formulario-articulo").hidden = false;
      var botones = document.getElementById("btnOpcion") as HTMLButtonElement;
      botones.innerHTML='<i class="fa fa-angle-left" ></i> Regresar';
      document.getElementById("btnOpcion").hidden=false;
      document.getElementById("titulo-card").innerHTML = "Completar Registro para el articulo : "+articulo.Descripcion;
      this.limpiarFormulario();
      this.articuloService.articuloSeleccionado.idarticulo = articulo.idArticulo;
      this.articuloService.articuloSeleccionado.cantidad = articulo.Cantidad;
      
    

    }else{
      this.vista ="1";
      document.getElementById("listaarticulos").hidden = false;
      document.getElementById("formulario-articulo").hidden = true;
      var botones = document.getElementById("btnOpcion") as HTMLButtonElement;
      botones.innerHTML='<i class="fa fa-plus" ></i> Agregar Articulo';
      document.getElementById("titulo-card").innerHTML = "Lista de Articulos";
      document.getElementById("btnOpcion").hidden=true;
    }
  }


  ngAfterViewInit(): void {
    this.dtTriggers.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTriggers.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTriggers.next();
    });
  }

  getArticulosMysql(){
    document.getElementById("carga").hidden = false;
    document.getElementById("listaarticulos").hidden=true;
    this.articuloService.getArticulosMysql()
    .subscribe(res=>{
      this.articuloService.articulosMysql = res as ArticuloMysql[];
      if(this.articuloService.articulosMysql.length == 0){
        console.log("No se encontraron datos");
      }else{
        console.log("Exito..");
        document.getElementById("listaarticulos").hidden=false;
      }   
      this.rerender();
      document.getElementById("carga").hidden = true;
    });
  }

  getCategorias(){
    this.categoriaService.getCategorias()
    .subscribe(res=>{
      this.listacategorias = res as Categoria[];
    });
  }

  getMarcas(){
    this.marcaService.getMarcas()
    .subscribe(res=>{
      this.listamarcas = res as Marca[];
    });
  }

  getCaracteristicas(){    
    for(var i=0;i<this.listacategorias.length;i++){
      if(this.articuloService.articuloSeleccionado.categoria == this.listacategorias[i]._id){
        this.listacaracteristicas = this.listacategorias[i].caracteristicas;       
      }
    }
    for(var i=0;i<this.listacaracteristicas.length;i++){
      this.listacaracteristicasarticulo.push(new CaracteristicaItem(this.listacaracteristicas[i].nombre,""));
    }
    console.log(this.listacategorias)
  }

  completaRegistro(articulomysql: ArticuloMysql){

  }
  
  editarArticulo(id: string){
    this.itemsDatosGenerales = new Array();
    this.articuloService.getArticulo(id)
    .subscribe(res=>{
      this.articuloService.articuloSeleccionado = res[0] as Articulo;
      this.imagenesSeleccionadas  = this.articuloService.articuloSeleccionado.imagenes;
      this.contenidoEditor = this.articuloService.articuloSeleccionado.descripcion;
      this.listacaracteristicasarticulo = this.articuloService.articuloSeleccionado.caracteristicas;
      for(var i=0;i<this.articuloService.articuloSeleccionado.especificaciones.length;i++){
        this.itemsDatosGenerales.push([i+1,this.articuloService.articuloSeleccionado.especificaciones[i]]);
      }
      this.vista ="2";
      document.getElementById("listaarticulos").hidden = true;
      document.getElementById("formulario-articulo").hidden = false;
      var botones = document.getElementById("btnOpcion") as HTMLButtonElement;
      botones.innerHTML='<i class="fa fa-angle-left" ></i> Regresar';
      document.getElementById("btnOpcion").hidden=false;
      document.getElementById("titulo-card").innerHTML = "Editar articulo  : "+id;
      console.log(res);
    });

  }
  agregarInformacionGeneral(){
    this.contador_datos_generales = this.contador_datos_generales+1;
    this.itemsDatosGenerales.push([this.contador_datos_generales,""]);
  }
  eliminarItem(id:Number){
    for(var i=0;i<this.itemsDatosGenerales.length;i++){
      if(this.itemsDatosGenerales[i][0] == id){
        this.itemsDatosGenerales.splice(i,1);
      }
    }
  }
  agregarCaractgarCaracteristica(){
    this.contador_caracteristicas = this.contador_caracteristicas+1;
    this.itemsCaracteristicas.push(this.contador_caracteristicas);
  }
  eliminarItemCaracteristica(id:Number){
    for(var i=0;i<this.itemsCaracteristicas.length;i++){
      if(this.itemsCaracteristicas[i] == id){
        this.itemsCaracteristicas.splice(i,1);
      }
    }
  }
 
  eliminarItemImagen(id:string){
    for(var i=0;i<this.imagenesSeleccionadas.length;i++){
      if(this.imagenesSeleccionadas[i] == id){
        this.imagenesSeleccionadas.splice(i,1);
        var inputcheck = document.getElementById(id) as HTMLInputElement;
        inputcheck.checked = false;
        console.log(inputcheck);
        console.log(id);

      }
    }
  }

  buscaNuevaImagen(){
    document.getElementById("imageninput").click();
  }
  buscaNuevaImagenEditor(){
    document.getElementById("btnimageneditor").click();
  }

  getListaImagenes(){
    
    this.articuloService.getImagenes()
      .subscribe(res=>{
        console.log(res);
        this.listaimagenes = res as string[];
      });
  }

  buscarImagen(){
    this.getListaImagenes();    
    
  }

  elegirImagen(nombre: string){
    this.imageneditorseleccionada = nombre;

  }
  agregarImagenEditor(){
    console.log("holamundo");
    console.log(this.imageneditorseleccionada);
    const range = this.editorInstance.getSelection();
    this.editorInstance.insertEmbed(range.index, 'image', this.URL_IMAGES+"/tmp/"+this.imageneditorseleccionada);

  }
  agregarImagenesArticulo(nombre: string){
    var existe = false;
    for(var i=0;i<this.imagenesSeleccionadas.length;i++){
      if(this.imagenesSeleccionadas[i] == nombre){
        this.imagenesSeleccionadas.splice(i,1);
        existe = true;     
      }
    }
    if(!existe){
      this.imagenesSeleccionadas.push(nombre);    
    }
  }
  agregarImagenes(){

  }
  subirImagen(evento){
    this.selectedFile  = <File> evento.target.files[0];
    //evento.preventDefault();
    const fd = new FormData();
    fd.append('image',this.selectedFile, this.selectedFile.name);
    this.http.post(this.URL_API,fd,{
      reportProgress: true,
      observe: 'events'
    })
    .subscribe(event=>{
        if(event.type === HttpEventType.UploadProgress){
          console.log("Subiendo "+ Math.round(event.loaded/event.total*100)+" %");
          /*progreso.style.width = Math.round(event.loaded/event.total*100)+"%";
          progreso.innerHTML = "Subiendo "+ Math.round(event.loaded/event.total*100)+" %";
          inputfile.style.display="none";*/
          if(Math.round(event.loaded/event.total*100) == 100){
            console.log("termino subir la imagen");
            console.log("Comprimiendo imagen");
          /*  progreso.innerHTML = "Comprimiendo Imagen....";
            inputfile.innerHTML = "";*/
          }
        
        }else{
          if(event.type === HttpEventType.Response){
            console.log(event.body);       
            this.getListaImagenes(); 
          }
        }
      }
    );
  }

 
  

  subirImagenEditor(evento){
    this.selectedFile  = <File> evento.target.files[0];
    //evento.preventDefault();
    const fd = new FormData();
    fd.append('image',this.selectedFile, this.selectedFile.name);
    this.http.post(this.URL_API,fd,{
      reportProgress: true,
      observe: 'events'
    })
    .subscribe(event=>{
        if(event.type === HttpEventType.UploadProgress){
          console.log("Subiendo "+ Math.round(event.loaded/event.total*100)+" %");
         
          if(Math.round(event.loaded/event.total*100) == 100){
            console.log("termino subir la imagen");
            console.log("Comprimiendo imagen");
          /*  progreso.innerHTML = "Comprimiendo Imagen....";
            inputfile.innerHTML = "";*/
          }
        
        }else{
          if(event.type === HttpEventType.Response){                  
            this.getListaImagenes(); 
            // var cont = document.getElementsByClassName("ql-editor")[0].innerHTML;
            //this.contenidoEditor = this.contenidoEditor + "<img src='"+this.URL_IMAGES+"/tmp/"+this.selectedFile.name; +"'>";   
            //console.log(this.contenidoEditor);    
           
            //document.getElementsByClassName("ql-editor")[0].innerHTML = cont+"<label>HOLA MUNDO FUNCIPNA</label>"
            //console.log(cont);   
            console.log(this.contenidoEditor);

          }
        }
      }
    );
  }

  guardarDatos(){

    //Obtener datos generales del articulo
    var datosgenerales = document.getElementById("contenido-datos-generales");
    var datos = datosgenerales.getElementsByTagName("input");
    for(var i=0;i<datos.length;i++){
      var dato = datos[i] as HTMLInputElement;
      if(dato.value != ""){
        this.articuloService.articuloSeleccionado.especificaciones.push(dato.value);
      }
    }

    //Obtener datos caracteristicas    
    var datoscaracteristicas = document.getElementById("contenido-datos-caracteristicas");  
    var caracteristicas = document.getElementsByClassName("item-caracteristicas");
    for(var i=0;i<caracteristicas.length -1 ;i++){
      var c = new CaracteristicaItem(caracteristicas[i].getElementsByTagName("input")[0].value,caracteristicas[i].getElementsByTagName("input")[1].value); 
        
      this.articuloService.articuloSeleccionado.caracteristicas.push(c);
  
      
    }

    //Asignar imagenes
    this.articuloService.articuloSeleccionado.imagenes = this.imagenesSeleccionadas;
    this.articuloService.articuloSeleccionado.descripcion = this.contenidoEditor;
    console.log(this.articuloService.articuloSeleccionado);

    //guardar datos

    this.articuloService.postArticulo(this.articuloService.articuloSeleccionado)
    .subscribe(res=>{      
      var respuesta = JSON.parse(JSON.stringify(res));
      if(respuesta.estado == "0"){   
        console.log("ERROR ");
      }else{        
        console.log("TODO ESTA CORRECTO");
      }          
    });
    

    

  }

}
