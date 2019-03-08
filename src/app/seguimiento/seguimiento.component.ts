import { Component, OnInit } from '@angular/core';
import { SeguimientoService } from './seguimiento.service';
import { Pedidos } from '../pedidos/pedidos';
import { PedidosService } from '../pedidos/pedidos.service';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {
  datcorreo: string = '';
  datnroped: string = '';
  arreglopedidos: any;
  estadoenv: string = '';

  constructor(public seguimientoservice: SeguimientoService, public pedidosservice: PedidosService) { }

  ngOnInit() {
  }

  consultar() {
    if (this.datcorreo != '') {
      console.log(this.datcorreo);
      this.consultaporcorreo(this.datcorreo);

    }
    else {
      if (this.datnroped != '') {
        console.log(this.datnroped);
        document.getElementById('datosSeg').hidden = false;
        this.consultapornroped();
      }
      else {
        alert('NO SE INGRESO NINGUN DATO !!!!')
      }
    }
  }
  consultaporcorreo(correo: string) {
    this.seguimientoservice.recuperarpedidoscorreo(correo)
      .subscribe(res => {
        this.arreglopedidos = JSON.parse(JSON.stringify(res));
        document.getElementById('datosSeg').hidden = false;
      });

  }
  consultapornroped() {

  }
  actualizar(i: number) {
    console.log(this.estadoenv);
    this.arreglopedidos[i].EstadoEnvio = this.estadoenv;
    console.log(this.arreglopedidos[i]);
    this.pedidosservice.actualizarpedido2(this.arreglopedidos[i])
      .subscribe(res => {
        console.log(res);
      });
  }

}
