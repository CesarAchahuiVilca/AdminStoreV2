import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Miga } from './miga';
import { SesionService } from './usuario/sesion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  sesionService     : SesionService;
  router            : Router;
  title = 'El Tribuno';
  ruta : boolean;
  migas: Miga[];

  constructor(location: Location, sesionService: SesionService, router: Router){
    this.sesionService = sesionService;
    this.router = router;
    this.ruta = location.path() == '/login';
    var home = new Miga('Inicio', '');
    this.migas = [];
  }

  ngOnInit(){
    this.sesionService.obtenerSesion().subscribe(res => {
      var jres = JSON.parse(JSON.stringify(res));
      if (!jres.status){
        this.router.navigate(['/login']);
        this.ruta = true;
      }
    });
  }

  migaEvent(componente: any){
    var miga = componente.miga ? componente.miga as Miga : new Miga('Sin miga de pan','/');
    this.migas.pop();
    this.migas.push(miga);
  }
}
