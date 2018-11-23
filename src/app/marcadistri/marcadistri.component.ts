import { DistribuidorService } from './distribuidor.service';
import { Distribuidormysql } from './distribuidormysql';
import { Component, OnInit } from '@angular/core';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { Subject } from 'rxjs';
import { MarcaMysql } from './marca-mysql';
import { MarcaService } from './marca.service';
import {HttpClient, HttpEventType} from '@angular/common/http';
import { Marca } from './marca';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-marcadistri',
  templateUrl: './marcadistri.component.html',
  styleUrls: ['./marcadistri.component.css'],
  providers:[MarcaService,DistribuidorService]
})

export class MarcadistriComponent implements AfterViewInit,OnDestroy,OnInit {
  //datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTriggers: Subject<any> = new Subject();
  dtTriggers2: Subject<any> = new Subject();
  flag: boolean = true;
  //fin
  constructor(private http: HttpClient,private marcaService:MarcaService, private distribuidorService:DistribuidorService) { }

  ngOnInit() {
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
    this.listardistri();
  }

  /* data table*/
  ngAfterViewInit(): void {
    this.dtTriggers.next();
    this.dtTriggers2.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTriggers.unsubscribe();
    this.dtTriggers2.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTriggers.next();
    });
  }
  rerender2(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTriggers2.next();
    });
  }
  /*fin datatable*/
  listarmarcas(){
    document.getElementById("carga").hidden = false;
    document.getElementById("listarmarcas").hidden=true;
    this.marcaService.listarmarcamysql()
    .subscribe(res =>{
      this.marcaService.marcaMysql=res as MarcaMysql[];

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

  listardistri(){
    document.getElementById("carga2").hidden = false;
    document.getElementById("listardistri").hidden=true;
    this.distribuidorService.listardistrimysql()
    .subscribe(res =>{
      this.distribuidorService.distriMysql=res as Distribuidormysql[];

      if(this.distribuidorService.distriMysql.length == 0){
        console.log("No se encontraron datos");
      }else{

        console.log("Exito..");
        document.getElementById("listardistri").hidden=false;
      }
      this.rerender2();
      document.getElementById("carga").hidden = true;
    });
  }

  guardartemdatos(marcamysql:MarcaMysql){
    document.getElementById("titulomodal").innerHTML = "Completar Registro para la Marca : "+marcamysql.NombreMarca;
  }

}
