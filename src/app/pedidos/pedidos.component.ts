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
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

export interface PedidosData {
  _id: string;
  idUsuario: string;
  entrega: string;
  fecha: string;
  pago: string;
  total: string;
  estado: string;
  direccion: string;
}


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
  router: Router;
  idPedido: string = '';
  textofiltro: string = '';
  //table 2
  displayedColumns: string[] = ['_id', 'idUsuario', 'entrega', 'fecha', 'pago', 'total', 'estado', 'btn'];
  dataSource: MatTableDataSource<PedidosData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //
  //datatable
  /*@ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTriggers: Subject<any> = new Subject();
  dtTriggers2: Subject<any> = new Subject();
  flag: boolean = true;*/
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
  preciototalcarritos: number = 0;
  totalcarritos: number = 0;
  carPagados: number = 0;
  carProceso: number = 0;
  carReembolso: number = 0;
  carErrorPago: number = 0;
  tipodoc: string = '';
  seriedoc: string = '';
  numerodoc: string = '';
  //mensaje alert
  mensajeestado: string;
  DocumentoAct: temdoc[] = [{ Tipo: 'BBV', Serie: '1', Numero: '0001' }];
  //fin
  // tabla material
  listpedidos: any[] = new Array();/* [
    { numeroped: '12', cliente: 'paul', entrega: '57%', fecha: '2019-01-12', pago: 'proceso', total: '1250', estado: 'yellow' },
    { numeroped: '12', cliente: 'paul', entrega: '57%', fecha: '2019-01-12', pago: 'proceso', total: '1250', estado: 'yellow' }
  ];*/
  //
  //datos temp
  listadatos: string[] = ['datos1', 'datos2', 'datos3', 'datos4', 'datos5', 'dtos6', 'datos7'];
  migas = [new Miga('Pedidos', '/pedidos')];
  //fin datos temp
  constructor(public snackBar: MatSnackBar, public http: HttpClient, public pedidosservice: PedidosService, public usuarioservice: UsuarioService) {
    //table material
    // Assign the data to the data source for the table to render   JSON.parse(JSON.stringify(this.listpedidos))
    //  console.log(datos);
    //console.log(JSON.parse(JSON.stringify(this.listpedidos)));
    this.dataSource = new MatTableDataSource(this.listpedidos);
    //
  }

  ngOnInit() {
    document.getElementById('tablapedidos').focus();
    //table material
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //
    document.getElementById('dettallepedido').hidden = true;
    document.getElementById('tabladetallepedido').hidden = true;
    document.getElementById('divnombrecliente').hidden = true;
    this.listarpedidost();
    //datatable
    /* this.dtOptions = {
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
     this.applyFilter('');*/
  }
  //table material
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  //
  /* data table*/
  ngAfterViewInit(): void {
    /* this.dtTriggers.next();
     this.dtTriggers2.next();*/
    //console.log(this.pedidosservice.pedidos);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    /* this.dtTriggers.unsubscribe();
     this.dtTriggers2.unsubscribe();*/
  }

  /* rerender(): void {
     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
       dtInstance.destroy();
       this.dtTriggers.next();
     });
   }*/
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
        this.totalcarritos = this.pedidosservice.pedidos.length;
        for (var j = 0; j < this.pedidosservice.pedidos.length; j++) {
          this.preciototalcarritos = this.preciototalcarritos + Number(this.pedidosservice.pedidos[j].PrecioTotal)
          this.listpedidos.push({ _id: this.pedidosservice.pedidos[j]._id, idUsuario: this.pedidosservice.pedidos[j].idUsuario, entrega: this.pedidosservice.pedidos[j].EstadoEnvio, fecha: this.pedidosservice.pedidos[j].FechaCompra, pago: this.pedidosservice.pedidos[j].idTipoPago, total: this.pedidosservice.pedidos[j].PrecioTotal, estado: this.pedidosservice.pedidos[j].EstadoPago, direccion: this.pedidosservice.pedidos[j].idDireccion });
        }
        // this.dataSource = new MatTableDataSource(this.listpedidos);
        this.filtrarCarritos('1');
        this.funcionprueba();
      });
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
    this.pedidosservice.actualizarpedido(this.listapedidouni)
      .subscribe(res => {
        console.log(res);
      });
    this.snackBar.open('Pago Guardado', '🧓🏻', {
      duration: 2000,
    });
    location.reload();
  }

  filtrarCarritos(id: string) {
    if (id == '1') {
      this.applyFilter('');
    }
    if (id == '2') {
      this.applyFilter('Pagado');
    }
    if (id == '3') {
      this.applyFilter('Proceso');
    }
    if (id == '4') {
      this.applyFilter('Reembolso');
    }
    if (id == '5') {
      this.applyFilter('Error de Pago');
    }
  }


  funcionprueba() {
    var arr = new Array(),//[2, 1, 3, 2, 8, 9, 1, 3, 1, 1, 1, 2, 24, 25, 67, 10, 54, 2, 1, 9, 8, 1],
      ArrOrdenado = [],
      count = 1;
    for (var k = 0; k < this.listpedidos.length; k++) {
      arr.push(this.listpedidos[k].estado);
    }
    console.log(arr);
    ArrOrdenado = arr.sort(function (a, b) {
      return a - b
    });
    for (var i = 0; i < ArrOrdenado.length; i = i + count) {
      count = 1;
      for (var j = i + 1; j < ArrOrdenado.length; j++) {
        if (ArrOrdenado[i] === ArrOrdenado[j])
          count++;
      }
      console.log(ArrOrdenado[i] + " = " + count);
      if (ArrOrdenado[i] == 'Pagado') {
        console.log(ArrOrdenado[i] + " = " + count);
        this.carPagados = count;
      }
      if (ArrOrdenado[i] == 'Proceso') {
        console.log(ArrOrdenado[i] + " = " + count);
        this.carProceso = count;
      }
      if (ArrOrdenado[i] == 'Reembolso') {
        console.log(ArrOrdenado[i] + " = " + count);
        this.carReembolso = count;
      }
      if (ArrOrdenado[i] == 'Error de pago') {
        console.log(ArrOrdenado[i] + " = " + count);
        this.carErrorPago = count;
      }
    }
  }
}



//table 
