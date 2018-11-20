import { Component, OnInit } from '@angular/core';
import{ ArticuloService} from './articulo.service';
import {HttpClient, HttpEventType} from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Articulo } from './articulo';
import { ArticuloMysql } from './articuloMysql';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css'],
  providers: [ArticuloService]
})
export class ArticuloComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTriggers: Subject<any> = new Subject();

  constructor(private http: HttpClient, private articuloService: ArticuloService) { }

  ngOnInit() {
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

  getArticulosMysql(){
    this.articuloService.getArticulosMysql()
    .subscribe(res=>{
      this.articuloService.articulosMysql = res as ArticuloMysql[];
      if(this.articuloService.articulosMysql.length == 0){
        console.log("No se encontraron datos");
      }else{

        console.log("Exito..");
      }
      this.dtTriggers.next();
    });
  }


}
