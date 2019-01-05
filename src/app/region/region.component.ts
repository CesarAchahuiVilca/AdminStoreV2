import { Component, OnInit } from '@angular/core';
import { NgFlashMessageService } from 'ng-flash-messages';
import { NgForm } from '@angular/forms';
import { Provincia } from './provincia';
import { Region } from './region';
import { RegionService } from './region.service';
import { Miga } from '../miga';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css'],
  providers: [RegionService]
})
export class RegionComponent implements OnInit {

  private departamentos : Region[];
  private depSelected : Region;
  private provincias : Provincia[];
  private provSelected : Provincia;
  private distritos : string[];
  private lblDepartamento : string;
  private lblProvincia : string;
  migas = [new Miga('Locales', '/region')];

  constructor(
    private regionService : RegionService,
    private flashMessage : NgFlashMessageService
    ) { }

  ngOnInit() { 
    this.provSelected = new Provincia('',[]);
    this.depSelected = new Region(null,'',[this.provSelected]);
    this.provincias = [];
    this.lblDepartamento = 'Nuevo Departamento';
    this.lblProvincia = 'Nueva Provincia';
    this.getRegiones();
    document.getElementById('divProvincia').hidden = true;
    document.getElementById('divDistrito').hidden = true;
    document.getElementById('btnDepartamento').innerHTML = '<i class="fa fa-plus"></i>';
    document.getElementById('btnProvincia').innerHTML = '<i class="fa fa-plus"></i>';
    document.getElementById('spanDepartamento').hidden = true;
    document.getElementById('spanProvincia').hidden = true;
    document.getElementById('spanDistrito').hidden = true;
  }

  dep_selected(departamento : string){
    var i : number = 0;
    while(this.regionService.regiones[i].departamento != departamento){
      i = i + 1;
    }
    this.depSelected = this.regionService.regiones[i];
    document.getElementById('divProvincia').hidden = false;
    this.regionService.departamentoSelected = this.regionService.regiones[i];
    this.lblDepartamento = 'Editar Departamento'
    document.getElementById('btnDepartamento').innerHTML = '<i class="fa fa-edit"></i>';
    document.getElementById('btnDepartamento').style.backgroundColor = 'orange';
    document.getElementById('spanDepartamento').hidden = false;
    this.provSelected = new Provincia("",[]);
    this.regionService.provinciaSelected = this.provSelected;
    document.getElementById('divDistrito').hidden = true;
    document.getElementById('btnProvincia').innerHTML = '<i class="fa fa-plus"></i>';
    document.getElementById('btnProvincia').style.backgroundColor = '#63c2de';
    document.getElementById('spanProvincia').hidden = true;
    this.lblProvincia = 'Nueva Provincia';
  }

  distSelected(distrito : string){
    document.getElementById('spanDistrito').hidden = false;
  }

  eliminarDepartamento(){
    this.regionService.deleteRegion(this.depSelected._id).subscribe(res =>{
      var jres = JSON.parse(JSON.stringify(res));
        if(jres.status){
          this.flashMessage.showFlashMessage({messages: [jres.msg], timeout: 5000, dismissible: true, type: 'success'});
          this.getRegiones();
          this.lblDepartamento = 'Nuevo Departamento';
          document.getElementById('btnDepartamento').innerHTML = '<i class="fa fa-plus"></i>';
          document.getElementById('btnDepartamento').style.backgroundColor = '#63c2de';
          document.getElementById('spanDepartamento').hidden = true;
          this.depSelected = new Region(null,'',[this.provSelected]);
        }else{
          this.flashMessage.showFlashMessage({messages: [jres.error], timeout: 5000,dismissible: true, type: 'danger'});
        }
    });
  }

  eliminarDistrito(distrito: string){
    var i : number = 0;
    while(this.provSelected.distritos[i] != distrito ){
      i = i + 1;
    }
    this.provSelected.distritos.splice(i,1);
    this.updateRegion(this.depSelected);
    this.regionService.distritoSelected = '';
  }

  eliminarProvincia(provincia : string){
    var i : number = 0;
    while(this.depSelected.provincias[i].provincia != provincia){
      i = i + 1;
    }
    this.depSelected.provincias.splice(i,1);
    this.updateRegion(this.depSelected);
    this.regionService.provinciaSelected = new Provincia('',[]);
  }

  getRegiones() {
    this.regionService.getRegiones().subscribe(res => {
      this.regionService.regiones = res as Region[];
    })
  }

  nuevaProvincia(form?: NgForm){
    if(!form.value._id) {
      this.depSelected.provincias.push(form.value);
    } 
    this.updateRegion(this.depSelected);
    form.reset();
    document.getElementById('btnProvincia').innerHTML = '<i class="fa fa-plus"></i>';
    document.getElementById('btnProvincia').style.backgroundColor = '#63c2de';
    document.getElementById('spanProvincia').hidden = true;
    this.lblProvincia = 'Nueva Provincia';
  }

  nuevoDepartamento(form?: NgForm) {
    if(form.value._id) {
      this.regionService.putRegion(form.value).subscribe(res =>{
        var jres = JSON.parse(JSON.stringify(res));
        if(jres.status){
          this.flashMessage.showFlashMessage({messages: [jres.msg], timeout: 5000, dismissible: true, type: 'success'});
          this.getRegiones();
          this.lblDepartamento = 'Nuevo Departamento';
          document.getElementById('btnDepartamento').innerHTML = '<i class="fa fa-plus"></i>';
          document.getElementById('btnDepartamento').style.backgroundColor = '#63c2de';
          document.getElementById('spanDepartamento').hidden = true;
          form.reset();
        }else{
          this.flashMessage.showFlashMessage({messages: [jres.error], timeout: 5000,dismissible: true, type: 'danger'});
        }
      })

    }else {
      this.regionService.postRegion(form.value).subscribe(res =>{
        var jres = JSON.parse(JSON.stringify(res));
        if(jres.status){
          this.flashMessage.showFlashMessage({messages: [jres.msg], timeout: 5000, dismissible: true, type: 'success'});
          this.getRegiones();
          form.reset();
        }else{
          this.flashMessage.showFlashMessage({messages: [jres.error], timeout: 5000,dismissible: true, type: 'danger'});
        }
      });
    }  
  }

  nuevoDistrito(form? :NgForm){
    this.provSelected.distritos.push(form.value.distrito);
    this.updateRegion(this.depSelected);
    form.reset();
  }

  prov_selected(provincia : string){ 
    var i : number = 0;
    while(this.depSelected.provincias[i].provincia != provincia){
      i = i + 1;
    }
    this.provSelected = this.depSelected.provincias[i] as Provincia;
    this.provSelected.distritos = this.provSelected.distritos ? this.provSelected.distritos : [];
    this.regionService.provinciaSelected = this.provSelected;
    document.getElementById('divDistrito').hidden = false;
    document.getElementById('btnProvincia').innerHTML = '<i class="fa fa-edit"></i>';
    document.getElementById('btnProvincia').style.backgroundColor = 'orange';
    document.getElementById('spanProvincia').hidden = false;
    this.lblProvincia = 'Editar Provincia';
  }

  resetForm(form?: NgForm) {
    if(form) {
      this.regionService.departamentoSelected = new Region();
      form.reset();
    }
  }

  updateRegion(region : Region){
    this.regionService.putRegion(region).subscribe(res =>{
      var jres = JSON.parse(JSON.stringify(res));
      if(jres.status){
        this.flashMessage.showFlashMessage({messages: [jres.msg], timeout: 5000, dismissible: true, type: 'success'});
      }else{
        this.flashMessage.showFlashMessage({messages: [jres.error], timeout: 5000,dismissible: true, type: 'danger'});
      }
    });
  }
}
