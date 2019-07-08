import { Component, OnInit } from '@angular/core';
import { SesionService } from './usuario/sesion.service';
import { Respuesta } from './usuario/respuesta';
import { Router } from '@angular/router';
import { UsuarioService } from './usuario/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: ['']
})
export class AppComponent implements OnInit{

  constructor(public usuarioService: UsuarioService, public router: Router){
  }

  ngOnInit(){
    if(!this.usuarioService.logueado()){
      this.router.navigate(['/login']);
    }
  }
}
