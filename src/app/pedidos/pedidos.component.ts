import { Precios } from './../planes/precios';
import { Articulo } from './../articulo/articulo';
import { Respuesta } from './../usuario/respuesta';
import { Usuario } from './../login/usuario';
import { UsuarioService } from './../usuario/usuario.service';
import { Component, OnInit } from '@angular/core';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, from } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Miga } from '../miga';
import { PedidosService } from './pedidos.service';
import { Pedidos } from './pedidos';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';



export interface temdoc {
  Tipo: String,
  Serie: String,
  Numero: String,
}

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  providers: [PedidosService]
})
export class PedidosComponent implements AfterViewInit, OnDestroy, OnInit {
  idPedido: string = '';
  //datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTriggers: Subject<any> = new Subject();
  dtTriggers2: Subject<any> = new Subject();
  flag: boolean = true;
  //fin
  fecha = new Date(Date.now());
  listapedidos: any;
  listapedidouni: any;
  Articuloarreglo = new Array();
  arreglocliente: any;
  cliente: string;
  clientesuser: string;
  listadireccion: any;
  direccionenvio: string;
  estadoenvio: string;
  fechacompra: string;
  fechaenvio: string;
  estadopago: string;
  tipopago: string;
  nrotrans: string;
  preciototal: number = 0;
  tipodoc: string = '';
  seriedoc: string = '';
  numerodoc: string = '';
  //mensaje alert
  mensajeestado: string;
  DocumentoAct: temdoc[] = [{ Tipo: 'BBV', Serie: '1', Numero: '0001' }];
  //fin
  // tabla material

  //
  //datos temp
  listadatos: string[] = ['datos1', 'datos2', 'datos3', 'datos4', 'datos5', 'dtos6', 'datos7'];
  migas = [new Miga('Pedidos', '/pedidos')];
  //fin datos temp
  constructor(public snackBar: MatSnackBar, public http: HttpClient, public pedidosservice: PedidosService, public usuarioservice: UsuarioService) { }

  ngOnInit() {
    document.getElementById('dettallepedido').hidden = true;
    document.getElementById('tabladetallepedido').hidden = true;
    document.getElementById('divnombrecliente').hidden = true;
    this.listarpedidost();
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
  cambiarvista(id: string, iduser: string, iddireccion: string, preciot: number) {
    document.getElementById('listapedidos').hidden = true;
    document.getElementById('dettallepedido').hidden = false;
    document.getElementById('tablapedido').hidden = true;
    document.getElementById('tabladetallepedido').hidden = false;
    document.getElementById('divnombrecliente').hidden = false;
    this.recuperarpedido(id);
    this.recuperarnombrecliente(iduser);
    this.recuperardireccion(iddireccion);
    this.preciototal = preciot;
    this.idPedido = id;
  }
  cambiarvista2() {
    document.getElementById('listapedidos').hidden = false;
    document.getElementById('dettallepedido').hidden = true;
    document.getElementById('tablapedido').hidden = false;
    document.getElementById('tabladetallepedido').hidden = true;
    document.getElementById('divnombrecliente').hidden = true;
  }
  cambiarestado() {
    document.getElementById('extadoselect').style.color = 'red'
    var optselect = document.getElementById('selectestado') as HTMLSelectElement;
    var idselect = optselect.value;
    console.log(idselect);
    document.getElementById('extadoselect').innerHTML = optselect.options[optselect.selectedIndex].text;
    this.estadoenvio = optselect.options[optselect.selectedIndex].text;
    // this.mensajeestado = optselect.options[optselect.selectedIndex].text;
  }
  cambiarestadopago() {
    document.getElementById('extadoselect2').style.color = 'red'
    var optselect = document.getElementById('selectestadopago') as HTMLSelectElement;
    var idselect = optselect.value;
    document.getElementById('extadoselect2').innerHTML = optselect.options[optselect.selectedIndex].text;
    this.estadopago = optselect.options[optselect.selectedIndex].text;
    // this.mensajeestado = optselect.options[optselect.selectedIndex].text;
  }
  actualizar() {
    this.snackBar.open('Estado Actualizado de Envio ->>', this.estadoenvio + '🧓🏻', {
      duration: 2000,
    });
    document.getElementById('extadoselect').style.color = 'black';

  }
  actualizar2() {
    this.snackBar.open('Estado Actualizado de Pago ->>', this.estadopago + '🧓🏻', {
      duration: 2000,
    });
    document.getElementById('extadoselect2').style.color = 'black';

  }
  //
  listarpedidost() {
    this.pedidosservice.listarpedidos()
      .subscribe(res => {
        this.pedidosservice.pedidos = res as Pedidos[];
        this.listapedidos = JSON.parse(JSON.stringify(res));
        //   this.pedidosservice.pedidos = res as Pedidos[];
      });
    // this.recuperarnombrecliente(Respuesta);
  }
  /* recuperarnombre(id: string) {
     this.usuarioservice.listarusuario(id)
       .subscribe(res => {
         var Respuesta2 = JSON.parse(JSON.stringify(res));
         this.cliente = Respuesta2.nombres;
         console.log(this.cliente)//+''+Respuesta2.apellidos;
       });
   }*/

  recuperarnombrecliente(id: string) {
    this.usuarioservice.listarusuario(id)
      .subscribe(res => {
        var Respuesta2 = JSON.parse(JSON.stringify(res));
        this.cliente = Respuesta2.nombres + ' ' + Respuesta2.apellidos;
        this.clientesuser = Respuesta2.correo;
        this.arreglocliente = Respuesta2;
      });
  }

  recuperarpedido(id: string) {
    this.pedidosservice.listarpedidouni(id)
      .subscribe(res => {
        this.listapedidouni = JSON.parse(JSON.stringify(res));
        this.estadoenvio = this.listapedidouni.EstadoEnvio;
        this.fechacompra = this.listapedidouni.FechaCompra;
        this.fechaenvio = this.fecha.toString();
        this.estadopago = this.listapedidouni.EstadoPago;
        this.tipopago = this.listapedidouni.idTipoPago;
        this.nrotrans = this.listapedidouni.NroTransaccion;
        this.Articuloarreglo = this.listapedidouni.Articulo;
        this.tipodoc = this.listapedidouni.Documento[0].Tipo;
        this.seriedoc = this.listapedidouni.Documento[0].Serie;
        this.numerodoc = this.listapedidouni.Documento[0].Numero;
        //  this.listararticulos();
      });
  }//944091466

  recuperardireccion(id: string) {
    this.pedidosservice.recuperardireccion(id)
      .subscribe(res => {
        this.listadireccion = JSON.parse(JSON.stringify(res));
        this.direccionenvio = this.listadireccion.direccion;
      });
  }
  actualizarpago() {
    var id = this.listapedidouni._id;
    this.DocumentoAct[0].Tipo = this.tipodoc;
    this.DocumentoAct[0].Serie = this.seriedoc;
    this.DocumentoAct[0].Numero = this.numerodoc;
    this.listapedidouni.Documento = this.DocumentoAct;
    this.listapedidouni.EstadoPago = this.estadopago;
    this.listapedidouni.EstadoEnvio = this.estadoenvio;
    /* this.pedidosservice.pedidoselec.Documento=this.DocumentoAct;
     this.pedidosservice.pedidoselec.EstadoPago=this.estadopago;
     this.pedidosservice.pedidoselec.EstadoEnvio=this.estadoenvio;*/
    this.pedidosservice.actualizarpedido(this.listapedidouni)
      .subscribe(res => {
        console.log(res);
      });
    console.log(id);
    this.recuperarpedido(id);
  }

  /*listararticulos() {
    console.log('entraaa');
    for (var j = 0; j < this.Articuloarreglo.length; j++) {
      this.preciototal=this.preciototal+this.Articuloarreglo[j].precio
    }
  }*/

}
