import { Component, OnInit } from '@angular/core';
import { Miga } from '../miga';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public migas = [ new Miga('Imágenes del Menú Principal','/home')];

  constructor() { }

  ngOnInit() {
  }

}
