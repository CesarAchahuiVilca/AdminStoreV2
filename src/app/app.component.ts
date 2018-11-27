import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Miga } from './miga';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'El Tribuno';
  ruta : boolean;
  migas: Miga[];

  constructor(location: Location){
    this.ruta = location.path() == '/login';
    var home = new Miga('Inicio', '');
    this.migas = [];
  }

  migaEvent(componente: any){
    var miga = componente.miga ? componente.miga as Miga : new Miga('Sin miga de pan','/');
    this.migas.pop();
    this.migas.push(miga);
  }
}
