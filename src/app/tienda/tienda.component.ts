import { Component, OnInit } from '@angular/core';
import { Tienda } from './tienda';
import { TiendaService } from './tienda.service';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {
  private tiendaService   : TiendaService;

  constructor(tiendaService: TiendaService) {
    this.tiendaService = tiendaService;
   }

  ngOnInit() {
    this.tiendaService.getTiendas().subscribe( res => {
      this.tiendaService.tiendas = res as Tienda[];
      console.log(this.tiendaService.tiendas);
    });
  }

}
