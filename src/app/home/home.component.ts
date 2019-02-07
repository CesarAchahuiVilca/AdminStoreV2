import { Component, OnInit } from '@angular/core';
import { Miga } from '../miga';
import { MatDialog } from '@angular/material';
import { ImagenCartelComponent } from './imagen-cartel/imagen-cartel.component';
import { ArticuloService } from '../articulo/articulo.service';
import { Articulo } from '../articulo/articulo';
import { SelectImagenComponent } from './select-imagen/select-imagen.component';

export interface Cartel {
  _id: string;
  idEquipo: string;
  urlImagen: string;
  tipo: string;
  link: string;
  activo: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public migas = [ new Miga('Imágenes del Menú Principal','/home')];
  cartelesEquipos : Cartel[] = [];
  cartelPlan: Cartel;
  cartelesAccesorios: Cartel[];
  imagenSelected : string;

  constructor(public dialog: MatDialog, public articuloService: ArticuloService) { }

  ngOnInit() {
    this.articuloService.getArticulos().subscribe( res => {
      this.articuloService.listaArticulos = res as Articulo[];
    });
    this.cartelesEquipos.length = 6;
  }

  subirImagen(){
    const dialogRef = this.dialog.open(ImagenCartelComponent, {
      width: '600px',
      panelClass: 'dialog'
    });
  }

  seleccionarImagen(indice: number){
    const dialogRef = this.dialog.open(SelectImagenComponent, {
      width: '600px',
      panelClass: 'dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cartelesEquipos[indice].urlImagen = result;
    });
  }

}
