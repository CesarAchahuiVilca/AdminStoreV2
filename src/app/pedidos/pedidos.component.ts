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

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  providers: [PedidosService]
})
export class PedidosComponent implements AfterViewInit, OnDestroy, OnInit {
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
  arreglocliente: any;
  cliente: string;
  clientesuser: string;
  iddireccionenvio: string;
  direccionenvio: string;
  estadoenvio: string;
  fechacompra: string;
  fechaenvio: string;
  estadopago: string;
  tipopago: string;
  nrotrans: string;
  //mensaje alert
  mensajeestado: string;
  //fin
  //datos temp
  listadatos: string[] = ['datos1', 'datos2', 'datos3', 'datos4', 'datos5', 'dtos6', 'datos7'];
  migas = [new Miga('Pedidos', '/pedidos')];
  //fin datos temp
  constructor(public snackBar: MatSnackBar, public http: HttpClient, public pedidosservice: PedidosService, public usuarioservice: UsuarioService) { }

  ngOnInit() {
    this.listarpedidost();
    //   console.log(this.listapedidos);
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
    document.getElementById('dettallepedido').hidden = true;
    document.getElementById('tabladetallepedido').hidden = true;
    document.getElementById('divnombrecliente').hidden = true;
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
  cambiarvista(id: string, iduser: string,iddireccion :string) {
    document.getElementById('listapedidos').hidden = true;
    document.getElementById('dettallepedido').hidden = false;
    document.getElementById('tablapedido').hidden = true;
    document.getElementById('tabladetallepedido').hidden = false;
    document.getElementById('divnombrecliente').hidden = false;
    console.log(id);
    console.log(iduser);
    this.recuperarpedido(id);
    this.recuperarnombrecliente(iduser);
    this.recuperardireccion(iddireccion);
  }
  cambiarestado() {
    document.getElementById('extadoselect').style.color = 'red'
    var optselect = document.getElementById('selectestado') as HTMLSelectElement;
    var idselect = optselect.value;
    console.log(idselect);
    document.getElementById('extadoselect').innerHTML = optselect.options[optselect.selectedIndex].text;
    this.estadoenvio = optselect.options[optselect.selectedIndex].text;
    // this.mensajeestado = optselect.options[optselect.selectedIndex].text;
    console.log(this.estadoenvio);
  }
  cambiarestadopago() {
    document.getElementById('extadoselect2').style.color = 'red'
    var optselect = document.getElementById('selectestadopago') as HTMLSelectElement;
    var idselect = optselect.value;
    console.log(idselect);
    document.getElementById('extadoselect2').innerHTML = optselect.options[optselect.selectedIndex].text;
    this.estadopago = optselect.options[optselect.selectedIndex].text;
    // this.mensajeestado = optselect.options[optselect.selectedIndex].text;
    console.log(this.estadoenvio);
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
    var Respuesta: any;
    this.pedidosservice.listarpedidos()
      .subscribe(res => {
        this.pedidosservice.pedidos = res as Pedidos[];
        Respuesta = JSON.parse(JSON.stringify(res));
        //   this.pedidosservice.pedidos = res as Pedidos[];
        this.listapedidos = Respuesta;
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
    console.log(this.listapedidos);
    this.usuarioservice.listarusuario(id)
      .subscribe(res => {
        var Respuesta2 = JSON.parse(JSON.stringify(res));
        this.cliente = Respuesta2.nombres + ' ' + Respuesta2.apellidos;
        this.clientesuser = Respuesta2.correo;
        this.arreglocliente = Respuesta2;
        console.log(this.arreglocliente);
      });
  }

  recuperarpedido(id: string) {
    this.pedidosservice.listarpedidouni(id)
      .subscribe(res => {
        this.listapedidouni = JSON.parse(JSON.stringify(res));
        console.log(this.listapedidouni);
        this.estadoenvio = this.listapedidouni.EstadoEnvio;
        this.fechacompra = this.listapedidouni.FechaCompra;
        this.fechaenvio = this.fecha.toString();
        this.estadopago = this.listapedidouni.EstadoPago;
        this.tipopago = this.listapedidouni.idTipoPago;
        this.nrotrans = this.listapedidouni.NroTransaccion;
        this.iddireccionenvio = this.listapedidouni.idDireccion;
        console.log(this.listapedidouni.idDireccion);
      });
  }

  recuperardireccion(id:string){
    console.log(id);
    this.pedidosservice.recuperardireccion(id)
    .subscribe(res=>{
      console.log('entra');
      console.log(res);
     var Respuesta=JSON.parse(JSON.stringify(res));
     this.direccionenvio=Respuesta.direccion; 
    });
  }

}
