import { Component, OnInit } from '@angular/core';
import { CaracteristicaService } from './caracteristica.service';
import { Caracteristica } from './caracteristica';

@Component({
  selector: 'app-caracteristicas',
  templateUrl: './caracteristicas.component.html',
  styleUrls: ['./caracteristicas.component.css'],
  providers: [CaracteristicaService]
})
export class CaracteristicasComponent implements OnInit {

  caracteristicaHeader: string = 'Hola Mundo';
  accionBoton: string = 'GUARDAR';

  constructor(private caracteristicaService: CaracteristicaService) { }

  ngOnInit() {
  }
  
}
