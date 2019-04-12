import { Constantes } from './../constantes';
import { Component, OnInit } from '@angular/core';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { Subject } from 'rxjs';
import { MarcaMysql } from './marca-mysql';
import { MarcaService } from './marca.service';
import {HttpClient, HttpEventType} from '@angular/common/http';
import { Marca } from './marca';
import { DataTableDirective } from 'angular-datatables';
import { Form, NgForm } from '@angular/forms';
import { Miga } from '../miga';

@Component({
  selector: 'app-marcadistri',
  templateUrl: './marcadistri.component.html',
  styleUrls: ['./marcadistri.component.css'],
  providers:[MarcaService]
})

export class MarcadistriComponent implements AfterViewInit,OnDestroy,OnInit {
 //datos temp
  selectedFile: File = null;
  todasMarcas: Marca[];
  idm:string='';
  nombrem:string='';
  //datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTriggers: Subject<any> = new Subject();
  flag: boolean = true;
  migas: Miga[] = [];
  //fin
  constructor(public http: HttpClient,public marcaService:MarcaService) {
    this.migas.push( new Miga('Marcas', 'marcadistri'));
   }

  ngOnInit() {
    var  imagen = document.getElementById("imagen-select") as HTMLImageElement;
    imagen.src ="//placehold.it/600x300?text=Ninguna Imagen Seleccionada";
    //datatable
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
    this.listarmarcas();
    document.getElementById('marca-detalle').hidden=true;
  }

  /* data table*/
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
  /*fin datatable*/
  listarmarcas(){
    document.getElementById("carga").hidden = false;
    document.getElementById("listarmarcas").hidden=true;
    this.marcaService.listarmarcamysql()
    .subscribe(res =>{
      this.marcaService.marcaMysql=res as MarcaMysql[];
      console.log(res);

      if(this.marcaService.marcaMysql.length == 0){
        console.log("No se encontraron datos");
      }else{

        console.log("Exito..");
        document.getElementById("listarmarcas").hidden=false;
      }
      this.rerender();
      document.getElementById("carga").hidden = true;
    });
  }

  guardartemdatos(marcamysql:MarcaMysql){
    document.getElementById("titulomodal").innerHTML = "Completar Registro para la Marca : "+marcamysql.NombreMarca;
    this.idm=marcamysql.idMarcaProducto;
    this.nombrem=marcamysql.NombreMarca;
    /*document.getElementById("idmarca").innerHTML=marcamysql.idMarcaProducto.toString();
    document.getElementById("nombremarca").innerHTML=marcamysql.NombreMarca.toString();*/
  }
  //imagen
  onFileSelected(event){
    var inputfile = document.getElementById("nombrearchivo") as HTMLDivElement;
    var file = document.getElementById("archivo") as HTMLInputElement;
    inputfile.innerHTML = file.value;
    this.selectedFile  = <File> event.target.files[0];
    console.log(event);
  }

  onUpload(evento){
    evento.preventDefault()
    var inputfile = document.getElementById("nombrearchivo") as HTMLDivElement;
    var progreso = document.getElementById("progreso") as HTMLDivElement;
    inputfile.innerHTML="";
    const fd = new FormData();
    fd.append('image',this.selectedFile, this.selectedFile.name);
    this.http.post(Constantes.URL_API_IMAGEN+'/subir',fd,{
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
            imagen.src =Constantes.URL_IMAGENES+"/md/"+this.selectedFile.name+".webp";
            progreso.style.backgroundColor = "green";
            progreso.innerHTML = "Completado.";   
            this.marcaService.marcaselect.imagen=this.selectedFile.name+".webp";                 
          }
        }
      }
    );
  }
  limpiarform(form?: NgForm){    
    if(form){   
      this.marcaService.marcaselect=new Marca();   
     // form.reset();      
     // document.getElementById("titulomodal").innerHTML='<i class="fa fa-plus"></i> Agregar Marca';
      var  imagen = document.getElementById("imagen-select") as HTMLImageElement;
      imagen.src ="//placehold.it/600x300?text=Ninguna Imagen Seleccionada";
      var progreso = document.getElementById("progreso") as HTMLDivElement;
     // progreso.innerHTML = "";
     // progreso.style.width = "0%";        
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
  //fin imagen
  getCategorias(){
    this.marcaService.listarmarcamysql()
    .subscribe(res=>{
      this.todasMarcas = res as Marca[];     
    });
  }
  guardarmarca(){
   var btncerrarmodal = document.getElementById("btnCerrarModal");
   
    this.marcaService.postMarca(this.marcaService.marcaselect)
    .subscribe(res => {
      var respuesta = JSON.parse(JSON.stringify(res));
      //this.limpiarform(form);
          //btncerrarmodal.click();
         // this.getCategorias();
          console.log("TODO ESTA CORRECTO");
          //this.mostrarmensaje(respuesta.mensaje, respuesta.estado);
    });
  }
  editarMarca(marca){
    document.getElementById('marca-detalle').hidden=false;
    document.getElementById('marcageneral').hidden=true;
    this.marcaService.getMarcaMongo(marca.idMarca).subscribe(res=>{
      this.marcaService.marcaselect = res as Marca;
      console.log(res);
      var  imagen = document.getElementById("imagen-select") as HTMLImageElement;
            imagen.src =Constantes.URL_IMAGENES+"/md/"+this.marcaService.marcaselect.imagen;
    })
  }

  
  cambiarvista(marca){
    console.log(marca);
    document.getElementById('marca-detalle').hidden=false;
    document.getElementById('marcageneral').hidden=true;
    this.marcaService.marcaselect.idMarca=marca.idMarcaProducto;
    this.marcaService.marcaselect.nombremarca=marca.NombreMarca;
  }
  regresar(){
    document.getElementById('marca-detalle').hidden=true;
    document.getElementById('marcageneral').hidden=false;
    this.marcaService.marcaselect = new Marca();
  }
}

