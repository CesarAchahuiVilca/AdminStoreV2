import { Component, OnInit } from '@angular/core';
import { SesionService } from './usuario/sesion.service';
import { Respuesta } from './usuario/respuesta';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: ['']
})
export class AppComponent implements OnInit{

  constructor(public sesionService: SesionService, public router: Router){
  }

  ngOnInit(){
    this.sesionService.obtenerSesion().subscribe(res => {
      var rspta = res as Respuesta;
      if(!rspta.status){
        this.router.navigate(['/']);
      }
    });
  }
}
