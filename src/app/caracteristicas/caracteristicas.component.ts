import { Caracteristica } from './caracteristica';
import { CaracteristicaService } from './caracteristica.service';
import { Component, OnInit, ViewChild} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { MatSnackBar } from '@angular/material';
import { Miga } from '../miga'
import { NgForm } from '@angular/forms';
import { Respuesta } from '../usuario/respuesta';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-caracteristicas',
  templateUrl: './caracteristicas.component.html',
  styleUrls: ['./caracteristicas.component.css'],
  providers: [CaracteristicaService]
})
export class CaracteristicasComponent implements OnInit {
 
  @ViewChild(DataTableDirective) dtElement : DataTableDirective; 
  public dtOptions: DataTables.Settings = {};
  public dtTriggers: Subject<any> = new Subject();
  public caracteristicaHeader: string;
  public accionBoton: string = 'GUARDAR';
  public indice : number;
  public migas = [ new Miga('Características','/caracteristicas')];

  constructor(public caracteristicaService: CaracteristicaService, public snackBar: MatSnackBar) {}

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

  /**
   * Métodod que elimina la característica seleccionada
   */
  deleteCaracteristica(){
    this.caracteristicaService.deleteCaracteristica(this.caracteristicaService.caracteristicaSelected).subscribe(res=> {
      const respuesta = res as Respuesta;
      if(respuesta.status) {
        this.openSnackBar(respuesta.status, respuesta.msg);
        this.caracteristicaService.caracteristicaSelected = new Caracteristica();
        this.caracteristicaService.caracteristicas.splice(this.indice,1);
        this.reRender();
      }else {
        this.openSnackBar(respuesta.status, respuesta.error);
      }
    })
  }

  /**
   * Método para modificar los datos de una características
   * @param caracteristica : datos de la característica
   */
  editarCaracteristica(caracteristica: Caracteristica){
    this.caracteristicaService.caracteristicaSelected = caracteristica;
  }

  /**
   * Método para obtener todas las características
   */
  getCaracteristicas(){
    this.caracteristicaService.getCaracteristicas().subscribe(res =>{
      this.caracteristicaService.caracteristicas = res as Caracteristica[];
      this.reRender();
    })
  }

  /**
   * Método para limpiar el formulario
   * @param form : datos del formulario
   */
  resetForm(form?: NgForm){
    if(form) {
      this.caracteristicaService.caracteristicaSelected = new Caracteristica();
      form.reset();
    }
  }

  /**
   * Método para guardar los datos de una características
   * @param form : datos de la característica
   */
  saveCaracteristica(form?: NgForm){
    if(form.value._id) {
      this.caracteristicaService.putCaracteristica(form.value).subscribe(res => {
        const respuesta = res as Respuesta;
        if(respuesta.status) {
          this.openSnackBar(respuesta.status, respuesta.msg);
          this.resetForm(form);
        }else {
          this.openSnackBar(respuesta.status, respuesta.error);
        }
      })
    }else {
      this.caracteristicaService.postCaracteristica(form.value).subscribe(res => {
        const respuesta = res as Respuesta;
        if(respuesta.status){
          this.openSnackBar(respuesta.status, respuesta.msg);
          this.resetForm(form);
          this.getCaracteristicas();
        }else {
          this.openSnackBar(respuesta.status, respuesta.error);
        }
      })
    }
  }

  /**
   * Método que selecciona una característica
   * @param caracteristica : datos de la característica
   * @param i : índice de la característica
   */
  selectCaracteristica(caracteristica: Caracteristica, i: number){
    this.caracteristicaService.caracteristicaSelected = caracteristica;
    this.indice = i;
  }

  /**
   * Método para actualizar los datos de una característica
   * @param caracteristica : datos de la característica seleccionada
   */
  updateCaracteristica(caracteristica: Caracteristica){
    this.caracteristicaService.putCaracteristica(caracteristica).subscribe(res =>{
      const respuesta = res as Respuesta;
      if (respuesta.status){
        this.openSnackBar(respuesta.status, respuesta.msg);
        this.getCaracteristicas();
      }else {
        this.openSnackBar(respuesta.status, respuesta.error);
      }
    })
  }

  /**
   * Método para abrir un bar que muestra un mensaje de confirmación
   * @param status : para definir el color del mensaje
   * @param mensaje : mensaje a mostrar
   */
  openSnackBar(status: boolean, mensaje: string): void {
    var clase = status ? 'exito' : 'error';
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 3000,
      panelClass: [clase],
      data: mensaje
    });
  }
  
}
