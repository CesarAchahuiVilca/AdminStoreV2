import { Component, OnInit } from '@angular/core';
import{ ArticuloService} from './articulo.service';
import {HttpClient, HttpEventType} from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Articulo } from './articulo';
import { ArticuloMysql } from './articuloMysql';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject, identity } from 'rxjs';

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

  constructor(private http: HttpClient, private articuloService: ArticuloService) { }

  ngOnInit() {
    this.itemsDatosGenerales.push([1,""]);
    this.itemsCaracteristicas.push(1);
    this.itemsImagenes.push("imagen-1");

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

  completaRegistro(articulomysql: ArticuloMysql){
    document.getElementById("titulomodal").innerHTML = "Completar Registro para el articulo : "+articulomysql.Descripcion;

  }
  editarArticulo(id: string){

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
  agregarCaracteristica(){
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
  agregarImagen(){
    this.contador_imagenes = this.contador_imagenes + 1;
    this.itemsImagenes.push("imagen-"+this.contador_imagenes);
  }
  eliminarItemImagen(id:string){
    for(var i=0;i<this.itemsImagenes.length;i++){
      if(this.itemsImagenes[i] == id){
        this.itemsImagenes.splice(i,1);
      }
    }
  }

  buscarImagen(iditem: string){
    if(this.itemsImagenes[this.itemsImagenes.length-1]==iditem){
      document.getElementById("imageninput").click();
      this.itemseleccionado = iditem;
    }
    
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
            var itemImagen = document.getElementById(this.itemseleccionado);
            var imagenes = itemImagen.getElementsByTagName("img");
            var simbolo = itemImagen.getElementsByTagName("i")[0];
            imagenes[0].hidden = false;
            simbolo.hidden = true;
            //var  imagen = document.getElementById("imagen-seleccionada") as HTMLImageElement;
            imagenes[1].hidden= false;
            itemImagen.style.minWidth = "0px";
            imagenes[1].src =this.URL_IMAGES+"/tmp/"+this.selectedFile.name;
           /* progreso.style.backgroundColor = "green";
            progreso.innerHTML = "Completado.";    */      
            
           // this.categoriaService.categoriaSeleccionada.imagen = this.selectedFile.name;
           //document.getElementById("imagen-seleccionada").hidden=false;
          // document.getElementById("simbolo-mas").hidden = true;
          this.agregarImagen();
          

          }
        }
      }
    );
  }


}
