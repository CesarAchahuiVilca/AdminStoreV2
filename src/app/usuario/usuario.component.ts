import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Direccion } from './direccion';
import { DireccionService } from './direccion.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Miga } from '../miga';
import { NgFlashMessageService } from 'ng-flash-messages';
import { NgForm } from '@angular/forms';
import { Provincia } from '../region/provincia';
import { Region } from '../region/region';
import { RegionService } from '../region/region.service';
import { Subject, from } from 'rxjs';
import { Usuario } from './usuario';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  providers: [ UsuarioService, 
    {provide: MAT_DATE_LOCALE, useValue: 'es-PE'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS} ]
})

export class UsuarioComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective) dtElement  : DataTableDirective; 
  dtOptions                                 : DataTables.Settings = {};
  dtTriggers                                : Subject<any> = new Subject();
  private boton_accion                      : string;
  private boton_direccion                   : string;
  private direccion_header                  : string;
  private flag                              : boolean = true;
  private habilitarCorreo                   : boolean = true;
  public migas                              = [new Miga('Clientes','usuarios')]
  private mostrarBotonDireccion             : boolean = false;
  private mostrarBotonLimpiar               : boolean = true;
  private mostrarBotonNuevo                 : boolean = false;
  private mostrarBotonVolver                : boolean = false;
  private mostrarCarga                      : boolean = true;
  private mostrarDireccion                  : boolean = false;
  private mostrarFechaAfiliacion            : boolean = false;
  private mostrarListaDirecciones           : boolean = false;
  private mostrarListaUsuarios              : boolean = false;
  private mostrarMensajeCliente             : boolean = false;
  private mostrarUsuarioForm                : boolean = false;
  private tiposDocumento                    : string[];
  private tiposVivienda                     : string[] = [ 'Casa', 'Oficina', 'Departamento', 'Edificio', 'Condominio', 'Otro'];
  private usuario_header                    : string;
  private usuarioService                    : UsuarioService;
  private flashMessage                      : NgFlashMessageService;
  private direccionService                  : DireccionService;
  private regionService                     : RegionService;
  //migas : [new Miga('usuarios','/usuarios')];
  
  /**
   * Constructor del componente Usuario
   * @param usuarioService 
   * @param flashMessage 
   * @param direccionService 
   * @param regionService 
   */
  constructor(private adapter: DateAdapter<any>, usuarioService : UsuarioService, flashMessage : NgFlashMessageService, direccionService : DireccionService, regionService : RegionService) {
      this.adapter.setLocale('es');
      this.usuarioService     = usuarioService;
      this.flashMessage       = flashMessage;
      this.direccionService   = direccionService;
      this.regionService      = regionService;
     }

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
    this.getUsuarios();
    this.mostrarCarga = false;
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
    form.value.usuario = this.usuarioService.usuarioSeleccionado._id;
    if(form.value._id) {
      this.direccionService.putDireccion(form.value).subscribe(res => {
        var jres = JSON.parse(JSON.stringify(res));
        if(jres.status) {
          this.mostrarMensaje(jres.msg,'success');
          this.mostrarDireccion = false;
        }else{
          this.mostrarMensaje(jres.error, 'danger');
        }
      });
    }else {
      this.direccionService.postDireccion(form.value).subscribe(res =>{
        var jres = JSON.parse(JSON.stringify(res));
        if (jres.status) {
          this.mostrarMensaje(jres.msg, 'success');
          this.mostrarDireccion = false;
          this.direccionService.direcciones.push(jres.data as Direccion);
        }else{
          this.mostrarMensaje(jres.error, 'danger');
        }
      });
    }  
  }

  /**
   * Método que agrega un nuevo usuario
   * @param form 
   */
  agregarUsuario(form?: NgForm) {
    var validacion : boolean = true;
    var mensaje : string;
    form.value.correo = this.usuarioService.usuarioSeleccionado.correo;
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
    this.boton_direccion = "EDITAR DIRECCIÓN";
    this.direccion_header = "MODIFICAR DIRECCIÓN";
    var i = 0;
    while(this.regionService.regiones[i].departamento != direccion.departamento){i++}
    this.regionService.departamentoSelected = this.regionService.regiones[i];
    i = 0;
    while(this.regionService.departamentoSelected.provincias[i].provincia != direccion.provincia) { i++}
    this.regionService.provinciaSelected = this.regionService.departamentoSelected.provincias[i];
    this.direccionService.dirSelected = direccion;
    this.mostrarDireccion = true;
  }

  /**
   * Método que muestra el formulario para editar un usuario
   * @param usuario 
   */
  editarUsuario(usuario: Usuario) {
    this.usuario_header = "MODIFICAR USUARIO";
    this.boton_accion = "GUARDAR CAMBIOS";
    this.usuarioService.usuarioSeleccionado = usuario;
    this.mostrarUsuarioForm = true;
    this.mostrarListaUsuarios = false;
    this.mostrarBotonLimpiar = false;
    this.mostrarBotonNuevo = false;
    this.mostrarBotonVolver = true;
    this.mostrarListaDirecciones = true;
    this.mostrarBotonDireccion = true;
    this.habilitarCorreo = false;
    this.getDirecciones(this.usuarioService.usuarioSeleccionado._id);
    this.getRegiones();
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
    this.mostrarUsuarioForm = false;
    this.mostrarListaUsuarios = true;
    this.mostrarBotonNuevo = true;
    this.mostrarBotonVolver = false;
    this.mostrarDireccion = false;
    this.mostrarListaDirecciones = false;
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
   * Método que muestra un flash message
   * @param mensaje 
   * @param tipo 
   */
  mostrarMensaje(mensaje: string, tipo: string){
    this.flashMessage.showFlashMessage({messages: [mensaje],dismissible: true, timeout: 5000, type: tipo});
  }

  /**
   * Método que muestra el formulario de una nueva dirección
   * @param form 
   * @param usuario 
   */
  nueva_direccion(form?: NgForm, usuario? : string){
    this.direccionService.dirSelected = new Direccion();
    this.resetDireccionForm(form);
    this.direccion_header = "NUEVA DIRECCIÓN";
    this.boton_direccion = "GUARDAR NUEVA DIRECCIÓN";
    this.mostrarDireccion = true;
    this.direccionService.dirSelected.usuario = usuario;
  }

  /**
   * Método que muestra el formulario para un nuevo usuario
   * @param form 
   */
  nuevo_usuario(form?: NgForm){
    this.resetForm(form);
    this.usuario_header = "NUEVO USUARIO";
    this.boton_accion = "CREAR USUARIO";
    this.mostrarUsuarioForm = true;
    this.mostrarListaUsuarios = false;
    this.mostrarBotonNuevo = false;
    this.mostrarBotonVolver = true;
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
