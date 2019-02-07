import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ArticuloService } from 'src/app/articulo/articulo.service';
import { Constantes } from '../../constantes';

@Component({
  selector: 'app-select-imagen',
  templateUrl: './select-imagen.component.html',
  styleUrls: ['./select-imagen.component.css']
})
export class SelectImagenComponent implements OnInit {

  listaImagenes : string[];
  urlImagen = Constantes.URL_IMAGENES;
  imagenSeleccionada : string;

  constructor(public dialogRef: MatDialogRef<SelectImagenComponent>, public articuloService: ArticuloService) { }

  ngOnInit() {
    this.articuloService.getImagenes().subscribe( res => {
      this.listaImagenes = res as string[];
    })
  }

  seleccionarImagen(imagen: string){
    this.imagenSeleccionada = imagen;  
  }

  cerrar(){
    this.dialogRef.close();
  }

}
