import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AdminStoreV2';
  ruta : boolean;

  constructor(location: Location){
    this.ruta = location.path() == '/login';
  }
}
