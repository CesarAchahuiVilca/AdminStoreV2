import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SesionService } from '../usuario/sesion.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: ['']
})
export class HeaderComponent implements OnInit {
  router        : Router;
  sesionService : SesionService;

  constructor(sesionService: SesionService, router: Router) {
    this.router = router;
    this.sesionService = sesionService;
  }

  ngOnInit() {
  }

  cerrarSesion(){
    this.sesionService.cerrarSesion().subscribe(res => {
      console.log(res);
      var jres = JSON.parse(JSON.stringify(res));
      if( jres.status ){
        this.router.navigate(['/']);
      }
    })
  }

}
