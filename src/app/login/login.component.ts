import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import { Respuesta } from '../usuario/respuesta';
import { Router } from '@angular/router';
import { SesionService } from '../usuario/sesion.service';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [''],
  providers: [ LoginService ]
})
export class LoginComponent implements OnInit {

  constructor(public loginService: LoginService, public router: Router, public sesionService: SesionService, public snackBar: MatSnackBar) {  }

  ngOnInit() {
    this.sesionService.obtenerSesion().subscribe(res => {
      const respuesta = res as Respuesta;
      if( respuesta.status){
        this.router.navigate(['/menu']);
      }
    });
  }

  /**
   * Método para iniciar sesión como administrador, verifica la base de datos del CELSYS
   * @param form : formulario con el usuario y contraseña
   */
  login(form?: NgForm) {
    this.loginService.login(form.value).subscribe(res =>{
      const respuesta = res as Respuesta;
      if(respuesta.status){
        this.openSnackBar(respuesta.status, respuesta.msg);
        this.router.navigate(['/menu']);
      } else {
        this.openSnackBar(respuesta.status, respuesta.error);
        this.resetForm(form)
      }
    });
  }

  /**
   * Método que muestra un Bar temporal para confirmar los mensajes de éxito y de error
   */
  openSnackBar(status: boolean, mensaje: string): void {
    var clase = status ? 'exito' : 'error';
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 3000,
      panelClass: [clase],
      data: mensaje
    });
  }

  /**
   * Método para limpiar los campos del formulario de inicio de sesión
   * @param form : formulario a limpiar
   */
  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.loginService.usuarioSeleccionado = new Usuario();
    }
  }
}
