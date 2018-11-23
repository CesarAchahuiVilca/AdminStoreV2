import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CaracteristicaService } from './caracteristica.service';
import { NgFlashMessageService }  from 'ng-flash-messages';
import { Caracteristica } from './caracteristica';

@Component({
  selector: 'app-caracteristicas',
  templateUrl: './caracteristicas.component.html',
  styleUrls: ['./caracteristicas.component.css'],
  providers: [CaracteristicaService]
})
export class CaracteristicasComponent implements OnInit {

  caracteristicaHeader: string;
  accionBoton: string = 'GUARDAR';

  constructor(
    private caracteristicaService: CaracteristicaService,
    private flashMessage: NgFlashMessageService
    ) { }

  ngOnInit() {
    this.caracteristicaHeader = 'NUEVA CATEGORÍA';
    this.accionBoton = 'Guardar';
  }

  getCaracteristicas(){
    this.caracteristicaService.getCaracteristicas().subscribe(res =>{
      this.caracteristicaService.caracteristicas = res as Caracteristica[];
    })
  }

  resetForm(form?: NgForm){
    if(form) {
      this.caracteristicaService.caracteristicaSelected = new Caracteristica();
      form.reset();
    }
  }

  saveCaracteristica(form?: NgForm){
    if(form.value._id) {
      this.caracteristicaService.putCaracteristica(form.value).subscribe(res => {
        
      })
    }else {

    }
  }
  
}
