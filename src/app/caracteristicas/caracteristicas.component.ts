import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CaracteristicaService } from './caracteristica.service';
import { NgFlashMessageService }  from 'ng-flash-messages';
import { Caracteristica } from './caracteristica';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-caracteristicas',
  templateUrl: './caracteristicas.component.html',
  styleUrls: ['./caracteristicas.component.css'],
  providers: [CaracteristicaService]
})
export class CaracteristicasComponent implements OnInit {

  @ViewChild(DataTableDirective) dtElement : DataTableDirective; 
  dtOptions: DataTables.Settings = {};
  dtTriggers: Subject<any> = new Subject();
  caracteristicaHeader: string;
  accionBoton: string = 'GUARDAR';
  indice : number;

  constructor(
    private caracteristicaService: CaracteristicaService,
    private flashMessage: NgFlashMessageService
    ) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ elementos",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }  
    };
    this.caracteristicaHeader = 'NUEVA CARACTERÍSTICA';
    this.accionBoton = 'Guardar';
    document.getElementById('carga').hidden = false;
    this.getCaracteristicas();
    document.getElementById('carga').hidden = true;
  }

  /**
   * Método que se ejecuta despues de cargar la vista del componente
   */
  ngAfterViewInit() : void {
    this.dtTriggers.next();
  }

  /**
   * Método que se ejecuta al destruir el datatable
   */
  ngOnDestroy() : void {
    this.dtTriggers.unsubscribe();
  }

  /**
   * Método que se ejecuta para revisualizar el datatable
   */
  reRender() : void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTriggers.next();
    });
  }

  deleteCaracteristica(){
    this.caracteristicaService.deleteCaracteristica(this.caracteristicaService.caracteristicaSelected).subscribe(res=> {
      var jres = JSON.parse(JSON.stringify(res));
      if(jres.status) {
        this.mostrarCaracteristica(jres.msg, 'success');
        this.caracteristicaService.caracteristicaSelected = new Caracteristica();
        this.caracteristicaService.caracteristicas.splice(this.indice,1);
        this.reRender();
      }else {
        this.mostrarCaracteristica(jres.error, 'danger');
      }
    })
  }

  editarCaracteristica(caracteristica: Caracteristica){
    this.caracteristicaService.caracteristicaSelected = caracteristica;
  }

  getCaracteristicas(){
    this.caracteristicaService.getCaracteristicas().subscribe(res =>{
      this.caracteristicaService.caracteristicas = res as Caracteristica[];
      this.reRender();
    })
  }

  mostrarCaracteristica(mensaje: string, tipo: string){
    this.flashMessage.showFlashMessage({messages: [mensaje], timeout: 5000, dismissible: true, type: tipo});
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
        var jres = JSON.parse(JSON.stringify(res));
        if(jres.status) {
          this.mostrarCaracteristica(jres.msg, 'success');
          this.resetForm(form);
        }else {
          this.mostrarCaracteristica(jres.error, 'danger');
        }
      })
    }else {
      this.caracteristicaService.postCaracteristica(form.value).subscribe(res => {
        var jres = JSON.parse(JSON.stringify(res));
        if(jres.status){
          this.mostrarCaracteristica(jres.msg,'success');
          this.resetForm(form);
          this.getCaracteristicas();
        }else {
          this.mostrarCaracteristica(jres.error, 'danger');
        }
      })
    }
  }

  selectCaracteristica(caracteristica: Caracteristica, i: number){
    this.caracteristicaService.caracteristicaSelected = caracteristica;
    this.indice = i;
  }

  updateCaracteristica(caracteristica: Caracteristica){
    this.caracteristicaService.putCaracteristica(caracteristica).subscribe(res =>{
      var jres = JSON.parse(JSON.stringify(res));
      if (jres.status){
        this.mostrarCaracteristica(jres.msg, 'success');
        this.getCaracteristicas();
      }else {
        this.mostrarCaracteristica(jres.error, 'danger');
      }
    })
  }
  
}
