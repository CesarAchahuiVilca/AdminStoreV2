import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
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
    console.log(form.value);
    this.loginService.login(form.value).subscribe(res =>{
      var xres = JSON.parse(JSON.stringify(res));
      if(xres.estado){
        this.flashMessage.showFlashMessage({messages: [xres.status], timeout: 5000, dismissible: true, type: 'success'});
        //this.router.navigate(['/']);       
      } else {
        this.flashMessage.showFlashMessage({messages: [xres.status], timeout: 5000,dismissible: true, type: 'danger'});
        //this.resetForm(form)
      }
    });
  }

}
