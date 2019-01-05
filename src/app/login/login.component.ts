import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from './usuario';
import { SesionService } from '../usuario/sesion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [''],
  providers: [ LoginService ]
})
export class LoginComponent implements OnInit {
  loginService    : LoginService;
  flashMessage    : NgFlashMessageService;
  router          : Router;
  sesionService   : SesionService;

  constructor(loginService: LoginService, flashMessage: NgFlashMessageService, router: Router, sesionService: SesionService) {
    this.loginService   = loginService;
    this.flashMessage   = flashMessage;
    this.router         = router;
    this.sesionService  = sesionService;
  }

  ngOnInit() {
    this.sesionService.obtenerSesion().subscribe(res => {
      var jres = JSON.parse(JSON.stringify(res));
      if( jres.status){
        this.router.navigate(['/menu']);
      }
    });
  }

  login(form?: NgForm) {
    this.loginService.login(form.value).subscribe(res =>{
      var xres = JSON.parse(JSON.stringify(res));
      if(xres.status){
        this.flashMessage.showFlashMessage({messages: [xres.msg], timeout: 5000, dismissible: true, type: 'success'});
        this.router.navigate(['/menu']);
      } else {
        this.flashMessage.showFlashMessage({messages: [xres.error], timeout: 5000,dismissible: true, type: 'danger'});
        this.resetForm(form)
      }
    });
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.loginService.usuarioSeleccionado = new Usuario();
    }
  }

}
