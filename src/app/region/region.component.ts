import { Component, OnInit } from '@angular/core';
import { NgFlashMessageService } from 'ng-flash-messages';
import { NgForm } from '@angular/forms';
import { Provincia } from './provincia';
import { Region } from './region';
import { RegionService } from './region.service';

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

  constructor(
    private regionService : RegionService,
    private flashMessage : NgFlashMessageService
    ) { }

  ngOnInit() { 
    this.provSelected = new Provincia('',[]);
    this.depSelected = new Region(null,'',[this.provSelected]);
    this.provincias = [];
    this.getRegiones();
    document.getElementById('divProvincia').hidden = true;
    document.getElementById('divDistrito').hidden = true;
  }

  agregarRegion(form? : NgForm){

  }

  dep_selected(departamento : string){
    var i : number = 0;
    while(this.regionService.regiones[i].departamento != departamento){
      i = i + 1;
    }
    this.depSelected = this.regionService.regiones[i];
    document.getElementById('divProvincia').hidden = false;
  }

  editRegion(region : Region){

  }

  getRegiones() {
    this.regionService.getRegiones().subscribe(res => {
      this.regionService.regiones = res as Region[];
    })
  }

  nuevaProvincia(form?: NgForm){
    this.depSelected.provincias.push(form.value);
    this.updateRegion(this.depSelected);
    form.reset();
  }

  nuevoDepartamento(form?: NgForm) {
    if(form.value._id) {

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
    document.getElementById('divDistrito').hidden = false;
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
