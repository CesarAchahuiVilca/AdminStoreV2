import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SesionService } from '../usuario/sesion.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: ['']
})
export class HeaderComponent implements OnInit {
  mensajes : number = 0;

  constructor(public sesionService: SesionService,public router: Router) {}

  ngOnInit() {
    this.sesionService.getNotificaciones().subscribe(res => {
      const rspta = JSON.parse(JSON.stringify(res));
      if( rspta.status) {
        this.mensajes = rspta.data;
      }
    })
  }

  cerrarSesion(){
    this.sesionService.cerrarSesion().subscribe(res => {
      var jres = JSON.parse(JSON.stringify(res));
      if( jres.status ){
        this.router.navigate(['/']);
      }
    })
  }

}
