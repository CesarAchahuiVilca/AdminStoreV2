import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ LoginService ]
})
export class LoginComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private flashMessage: NgFlashMessageService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login(form?: NgForm) {
    this.loginService.login(form.value).subscribe(res =>{
      var xres = JSON.parse(JSON.stringify(res));
      if(xres.status){
        this.flashMessage.showFlashMessage({messages: [xres.msg], timeout: 5000, dismissible: true, type: 'success'});
        document.getElementById('refrescar').click();
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
