import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from './usuario';
import { Direccion } from './direccion';
import { Region } from '../region/region';
import { Provincia } from '../region/provincia';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
// Sericios
import { UsuarioService } from './usuario.service';
import { DireccionService } from './direccion.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { RegionService } from '../region/region.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  providers: [ UsuarioService ]
})

export class UsuarioComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective) dtElement : DataTableDirective; 
  dtOptions: DataTables.Settings = {};
  dtTriggers: Subject<any> = new Subject();
  private boton_accion : string;
  private boton_direccion : string;
  private usuario_header : string;
  private direccion_header : string;
  private tiposDocumento : string[];
  private flag : boolean = true;
  
  /**
   * Constructor del componente Usuario
   * @param usuarioService 
   * @param flashMessage 
   * @param direccionService 
   * @param regionService 
   */
  constructor(
    private usuarioService : UsuarioService,
    private flashMessage : NgFlashMessageService,
    private direccionService : DireccionService,
    private regionService : RegionService
    ) { }

  /**
   * Método que se ejecuta al iniciar el componente
   */
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
    this.tiposDocumento = ['DNI'];
    document.getElementById('btnDireccion').hidden = true;
    this.getUsuarios();
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
   * Método que agrega una nueva dirección a un usuario
   * @param form 
   */
  agregarDireccion(form?: NgForm){
    if(form.value._id) {
      this.direccionService.putDireccion(form.value).subscribe(res => {
        var jres = JSON.parse(JSON.stringify(res));
        if(jres.status) {
          this.flashMessage.showFlashMessage({messages: [jres.msg], timeout: 5000, dismissible: true, type: 'success'});
          this.resetDireccionForm(form);
          this.getDirecciones(this.usuarioService.usuarioSeleccionado.correo);
        }else{
          this.flashMessage.showFlashMessage({messages: [jres.error], timeout: 5000, dismissible: true, type: 'danger'})
        }
      });
    }else {
      this.direccionService.postDireccion(form.value).subscribe(res =>{
        var jres = JSON.parse(JSON.stringify(res));
        if (jres.status) {
          this.flashMessage.showFlashMessage({messages: [jres.msg], timeout: 5000, dismissible: true, type: 'success'});
          this.getDirecciones(this.usuarioService.usuarioSeleccionado.correo);
          this.resetDireccionForm(form);
        }else{
          this.flashMessage.showFlashMessage({messages: [jres.error], timeout: 5000,dismissible: true, type: 'danger'});
        }
      });
    }  
  }

  /**
   * Método que agrega un nuevo usuario
   * @param form 
   */
  agregarUsuario(form?: NgForm) {
    console.log(form.value);
    var validacion : boolean = true;
    var mensaje : string;
    if(form.value.numeroDocumento == null || form.value.nombres == null || form.value.apellidos == null || form.value.correo == null || form.value.tipoDocumento == null || form.value.fechaNacimiento == null  || form.value.sexo == null){
      mensaje = 'Algunos campos del formulario no estan debidamente completados';
      validacion = false;
    }
    if(form.value.tipoDocumento == 'DNI'){
      var dni : string = form.value.numeroDocumento ? form.value.numeroDocumento : '';
      if (dni.length != 8){
        validacion = false;
        mensaje = 'El número de documento no es válido, un DNI sólo tiene 8 dígitos.';
      }
    }
    if(validacion){
      if(form.value._id) {
        this.usuarioService.putUsuario(form.value)
          .subscribe(res => {
            var jres = JSON.parse(JSON.stringify(res));
            if(jres.status){
              this.flashMessage.showFlashMessage({messages: [jres.msg], timeout: 5000, dismissible: true, type: 'success'});
              this.resetForm(form);
              this.getUsuarios();
            }else{
              this.flashMessage.showFlashMessage({messages: [jres.error], timeout: 5000, dismissible: true, type: 'danger'})
            }        
          });
      } else {
        form.value.password = form.value.numeroDocumento;
        this.usuarioService.postUsuario(form.value)
        .subscribe(res => {
          var jres = JSON.parse(JSON.stringify(res));
          if(jres.status){
            this.flashMessage.showFlashMessage({messages: [ jres.msg], timeout: 5000, dismissible: true, type: 'success'});
            this.getUsuarios();
            this.resetForm(form);
          } else {
            this.flashMessage.showFlashMessage({messages: [ jres.error], timeout: 5000,dismissible: true, type: 'danger'});
          }
        });
      }  
    } else {
      this.flashMessage.showFlashMessage({messages: [mensaje], timeout: 5000, dismissible: true, type : 'warning'});
    }
  }

  /**
   * Método que selecciona un departamento 
   * @param departamento 
   */
  departamento_selected(departamento : string){
    var i : number = 0;
    while(this.regionService.regiones[i].departamento != departamento){
      i = i + 1;
    }
    this.regionService.departamentoSelected = this.regionService.regiones[i];
    this.regionService.provinciaSelected = new Provincia("",[]);
  }

  /**
   * Método que muestra el formulario para editar una dirección
   * @param direccion 
   */
  editarDireccion(direccion : Direccion){
    this.boton_direccion = "Editar dirección";
    this.direccion_header = "MODIFICAR DIRECCIÓN";
    this.direccionService.dirSelected = direccion;
    document.getElementById('direccion').hidden = false;
  }

  /**
   * Método que muestra el formulario para editar un usuario
   * @param usuario 
   */
  editarUsuario(usuario: Usuario) {
    this.usuario_header = "MODIFICAR USUARIO";
    this.boton_accion = "Guardar Cambios";
    this.usuarioService.usuarioSeleccionado = usuario;
    document.getElementById('nuevo_usuario').hidden = false;
    document.getElementById('lista_usuarios').hidden = true;
    document.getElementById('limpiar').hidden = true;
    document.getElementById('nuevo').hidden = true;
    document.getElementById('volver').hidden = false;
    document.getElementById('lista_direcciones').hidden = false;
    document.getElementById('btnDireccion').hidden = false;
    document.getElementById('email').setAttribute("disabled", "true");
    this.getDirecciones(this.usuarioService.usuarioSeleccionado.correo);
  }

  /**
   * Método que obtiene las direcciones de un usuario
   * @param correo 
   */
  getDirecciones(correo : string) {
    this.direccionService.getDirecciones(correo).subscribe(res => {
      this.direccionService.direcciones = res  as Direccion[];
    })
  }

  /**
   * Método que muestra los usuarios de la base de datos
   */
  getUsuarios() {
    document.getElementById('nuevo_usuario').hidden = true;
    document.getElementById('lista_usuarios').hidden = false;
    document.getElementById('volver').hidden = true;
    document.getElementById('nuevo').hidden = false;
    document.getElementById('direccion').hidden = true;
    document.getElementById('lista_direcciones').hidden = true;
    this.usuarioService.getUsuarios().subscribe( res => {
      this.usuarioService.usuarios = res as Usuario[];
      this.reRender();
    });
  }

  /**
   * Método que obtiene las regiones o departamentos
   */
  getRegiones(){
    this.regionService.getRegiones().subscribe(res => {
      this.regionService.regiones = res as Region[];
    })
  }

  /**
   * Método que muestra el formulario de una nueva dirección
   * @param form 
   * @param usuario 
   */
  nueva_direccion(form?: NgForm, usuario? : string){
    this.resetDireccionForm(form);
    this.direccion_header = "NUEVA DIRECCIÓN";
    this.boton_direccion = "Guardar nueva dirección";
    document.getElementById('direccion').hidden = false;
    this.direccionService.dirSelected.usuario = usuario;
    this.getRegiones();
  }

  /**
   * Método que muestra el formulario para un nuevo usuario
   * @param form 
   */
  nuevo_usuario(form?: NgForm){
    this.resetForm(form);
    this.usuario_header = "NUEVO USUARIO";
    this.boton_accion = "Crear Usuario";
    document.getElementById('btnDireccion').hidden = true;
    document.getElementById('nuevo_usuario').hidden = false;
    document.getElementById('lista_usuarios').hidden = true;
    document.getElementById('limpiar').hidden = false;
    document.getElementById('nuevo').hidden = true;
    document.getElementById('volver').hidden = false;
    document.getElementById('email').removeAttribute('disabled');
    document.getElementById('email').setAttribute('editable','true');
  }

  /**
   * Método que muestra los distritos de una provincia seleccionada
   * @param provincia 
   */
  provincia_selected(provincia: string){
    var i : number = 0;
    while(this.regionService.departamentoSelected.provincias[i].provincia != provincia){
      i = i + 1;
    }
    this.regionService.provinciaSelected = this.regionService.departamentoSelected.provincias[i];
  }

  /**
   * Método que vuelve a cargar el formulario de dirección
   * @param form 
   */
  resetDireccionForm(form?: NgForm) {
    if(form) {
      this.direccionService.dirSelected = new Direccion();
      form.reset();
    }
  }

  /**
   * Método que vuelve a cargar el formulario de usuario
   * @param form 
   */
  resetForm(form?: NgForm) {
    if (form) {  
      this.usuarioService.usuarioSeleccionado = new Usuario();
      form.reset();
    }
  }

}
