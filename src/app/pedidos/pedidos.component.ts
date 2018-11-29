import { Component, OnInit } from '@angular/core';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { HttpSentEvent } from '@angular/common/http';
import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements AfterViewInit,OnDestroy,OnInit {
   //datatable
   @ViewChild(DataTableDirective)
   dtElement: DataTableDirective;
   dtOptions: DataTables.Settings = {};
   dtTriggers: Subject<any> = new Subject();
   dtTriggers2: Subject<any> = new Subject();
   flag: boolean = true;
   //fin
   //mensaje alert
   mensajeestado:string;
   //fin
   //datos temp
   listadatos:string[]=['datos1','datos2','datos3','datos4','datos5','dtos6','datos7'];
   //fin datos temp
  constructor(public snackBar: MatSnackBar) { }

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
        document.getElementById('dettallepedido').hidden=true;
        document.getElementById('tabladetallepedido').hidden=true;
        document.getElementById('divnombrecliente').hidden=true;
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
  cambiarvista(){
    document.getElementById('listapedidos').hidden=true;
    document.getElementById('dettallepedido').hidden=false;
    document.getElementById('tablapedido').hidden=true;
    document.getElementById('tabladetallepedido').hidden=false;
    document.getElementById('divnombrecliente').hidden=false;
  }
  cambiarestado(){
    document.getElementById('extadoselect').style.color='red'
    var optselect=document.getElementById('selectestado') as HTMLSelectElement;
    var idselect=optselect.value;
    console.log(idselect);
    document.getElementById('extadoselect').innerHTML=optselect.options[optselect.selectedIndex].text;
    this.mensajeestado=optselect.options[optselect.selectedIndex].text;
  }
  actualizar(){
    this.snackBar.open('Estado Actualizado',this.mensajeestado , {
      duration: 2000,
    });
    document.getElementById('extadoselect').style.color='black';
    
  }

}
