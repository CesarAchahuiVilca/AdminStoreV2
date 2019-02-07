import { Component, OnInit } from '@angular/core';
import { Miga } from '../miga';
import { MatDialog } from '@angular/material';
import { ImagenCartelComponent } from './imagen-cartel/imagen-cartel.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public migas = [ new Miga('Imágenes del Menú Principal','/home')];

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  subirImagen(){
    const dialogRef = this.dialog.open(ImagenCartelComponent, {
      width: '600px',
      panelClass: 'dialog'
    });
  }

}
