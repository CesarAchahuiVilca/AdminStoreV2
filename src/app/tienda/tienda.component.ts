import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Miga } from '../miga';
import { NgForm } from '@angular/forms';
import { NgFlashMessageService } from 'ng-flash-messages';
import { Tienda } from './tienda';
import { TiendaService } from './tienda.service';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {
  private botonAccion     : string = "Agregar";
  private mostrarTienda   : boolean;
  private flashMessage    : NgFlashMessageService;
  private tiendaService   : TiendaService;
  private displayedColumns: string[] = ['nombre', 'latitud', 'longitud', 'edit'];
  dataSource              : MatTableDataSource<Tienda>; // = new MatTableDataSource(ELEMENT_DATA);
  migas                    = [ new Miga('Tienda','locales')];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(tiendaService: TiendaService, flashMessage: NgFlashMessageService) {
    this.flashMessage = flashMessage;
    this.tiendaService = tiendaService;
    this.mostrarTienda = true;
   }

  ngOnInit() {
    this.tiendaService.getTiendas().subscribe( res => {
      var jres = JSON.parse(JSON.stringify(res));
      this.tiendaService.tiendas = jres.data as Tienda[];
      this.dataSource = new MatTableDataSource(this.tiendaService.tiendas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  agregarTienda(form?: NgForm){
    if(this.tiendaService.tienda._id){
      this.tiendaService.putTienda(this.tiendaService.tienda).subscribe( res => {
        var jres = JSON.parse(JSON.stringify(res));
        if(jres.status){
          this.mostrarTienda = this.mostrarTienda ? false : true;
          form.resetForm();
          this.mostrarMensaje(jres.msg, 'success');
        } else {
          this.mostrarMensaje(jres.error,'danger');
        }
      });
    } else {
      this.tiendaService.postTienda(this.tiendaService.tienda).subscribe( res => {
        var jres = JSON.parse(JSON.stringify(res));
        if(jres.status){
          this.mostrarMensaje(jres.msg, 'success');
          this.tiendaService.tienda = new Tienda();
          this.mostrarTienda = this.mostrarTienda ? false : true;
          form.resetForm();
          this.tiendaService.tiendas.push(jres.data as Tienda);
          this.dataSource.sort = this.sort;
        } else {
          this.mostrarMensaje(jres.error, 'danger');
        }
      });
    }
  }

  aplicarFiltro(filtro: string){
    this.dataSource.filter = filtro.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editarTienda(tienda: Tienda){
    this.tiendaService.tienda = tienda;
    this.mostrarTienda = this.mostrarTienda ? false : true;
    this.botonAccion = 'MODIFICAR TIENDA';
  }

  mostrarMensaje(mensaje: string, tipo: string){
    this.flashMessage.showFlashMessage({messages: [mensaje], dismissible: true, timeout: 5000, type: 'tipo'});
  }

  nuevaTienda(form?: NgForm){
    this.tiendaService.tienda = new Tienda();
    this.botonAccion = 'AGREGAR TIENDA';
    form.resetForm();
    this.mostrarTienda = this.mostrarTienda ? false : true;
  }

}
