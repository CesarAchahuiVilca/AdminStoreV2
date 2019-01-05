import { Component, OnInit } from '@angular/core';
import { PlanesService} from './planes.service';
import { TipoPlan } from './tipoplan';
import { Plan } from './plan';
import { Miga } from '../miga';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css']
})
export class PlanesComponent implements OnInit {
  migas = [new Miga('Planes', '/planes')];

  constructor( public planesService: PlanesService) { }

  ngOnInit() {
    this.getTipoPlanes();
  }
  getTipoPlanes(){
    this.planesService.getTipoPlanes()
    .subscribe(res=>{
      this.planesService.tipoplanes = res as TipoPlan[];
      console.log(this.planesService.tipoplanes);
    });
  }
  mostrarPlanes(tipoplan){
    this.planesService.tipoPlanSeleccionado = tipoplan;
  }
  editarPlan(plan: Plan){
    this.planesService.planSeleccionado = plan;
    console.log(this.planesService.planSeleccionado);
  }
  guardarDatosPlan(){

    console.log(this.planesService.planSeleccionado);
    this.planesService.putTipoPlan()
    .subscribe(res=>{
      console.log(res);
      this.getTipoPlanes();
      this.planesService.planSeleccionado = new Plan();
      this.planesService.tipoPlanSeleccionado = new TipoPlan();
    });

  }
  eliminarPlan(plan: Plan){
    this.planesService.planSeleccionado = plan;
  }
  procesarEliminarPlan(){
    this.planesService.deletePlan()
    .subscribe(res=>{
      console.log(res);
      this.getTipoPlanes();
      this.planesService.planSeleccionado = new Plan();
      this.planesService.tipoPlanSeleccionado = new TipoPlan();
    });
  }

}
