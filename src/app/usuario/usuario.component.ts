import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { DataTableDirective } from 'angular-datatables';
import { Direccion } from './direccion';
import { DireccionService } from './direccion.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatSnackBar, MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { Miga } from '../miga';
import { NgForm } from '@angular/forms';
import { Provincia } from '../region/provincia';
import { Region } from '../region/region';
import { RegionService } from '../region/region.service';
import { Respuesta } from '../usuario/respuesta';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { Subject } from 'rxjs';
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

export class UsuarioComponent implements  OnInit {

  //@ViewChild(DataTableDirective) dtElement  : DataTableDirective; 
  //dtOptions                                 : DataTables.Settings = {};
  //dtTriggers                                : Subject<any> = new Subject();
  boton_accion                      : string;
  boton_direccion                   : string;
  direccion_header                  : string;
  flag                              : boolean = true;
  habilitarCorreo                   : boolean = true;
  migas                             = [new Miga('Clientes','usuarios')]
  mostrarBotonDireccion             : boolean = false;
  mostrarBotonLimpiar               : boolean = true;
  mostrarBotonNuevo                 : boolean = false;
  mostrarBotonVolver                : boolean = false;
  mostrarCarga                      : boolean = true;
  mostrarDireccion                  : boolean = false;
  mostrarFechaAfiliacion            : boolean = false;
  mostrarListaDirecciones           : boolean = false;
  mostrarListaUsuarios              : boolean = false;
  mostrarMensajeCliente             : boolean = false;
  mostrarUsuarioForm                : boolean = false;
  tiposDocumento                    : string[];
  tiposVivienda                     : string[] = [ 'Casa', 'Oficina', 'Departamento', 'Edificio', 'Condominio', 'Otro'];
  usuario_header                    : string;
  usuarioDataSource                 : MatTableDataSource<Usuario>;
  direccionDataSource               : MatTableDataSource<Direccion>;
  @ViewChild(MatPaginator) upaginator: MatPaginator;
  @ViewChild(MatSort) usort         : MatSort;
  @ViewChild(MatPaginator) dpaginator: MatPaginator;
  @ViewChild(MatSort) dsort         : MatSort;
  @ViewChild(MatTable) table        : MatTable<any>;
  usuarioColumns: string[] = ['correo', 'nombres', 'documento', 'afiliacion', 'edit'];
  direccionColumns: string[] = ['direccion', 'departamento', 'provincia', 'distrito'];
  
  /**
   * Constructor del componente Usuario
   * @param usuarioService 
   * @param flashMessage 
   * @param direccionService 
   * @param regionService 
   */
  constructor(public adapter: DateAdapter<any>,public usuarioService : UsuarioService, public direccionService : DireccionService, public regionService : RegionService, public snackBar: MatSnackBar) {
      this.adapter.setLocale('es');
     }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit() {
    /*this.dtOptions = {
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
    };*/
    this.tiposDocumento = ['DNI'];
    this.getUsuarios();
    this.mostrarCarga = false;
  }

  /**
   * Método que se ejecuta despues de cargar la vista del componente
   */
  /*ngAfterViewInit() : void {
    this.dtTriggers.next();
  }*/

  /**
   * Método que se ejecuta al destruir el datatable
   */
  /*ngOnDestroy() : void {
    this.dtTriggers.unsubscribe();
  }*/

  /**
   * Método que se ejecuta para revisualizar el datatable
   */
  /*reRender() : void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTriggers.next();
    });
  }*/

  /**
   * Método que agrega una nueva dirección a un usuario
   * @param form : formulario de dirección
   */
  agregarDireccion(form ? : NgForm) {
    form.value.usuario = this.usuarioService.usuarioSeleccionado._id;
    if (form.value._id) {
      this.direccionService.putDireccion(form.value).subscribe(res => {
        const respuesta = res as Respuesta;
        if (respuesta.status) {
          this.openSnackBar(respuesta.status, respuesta.msg);
          this.mostrarDireccion = false;
        } else {
          this.openSnackBar(respuesta.status, respuesta.error);
        }
      });
    } else {
      this.direccionService.postDireccion(form.value).subscribe(res => {
        const respuesta = res as Respuesta;
        if (respuesta.status) {
          this.openSnackBar(respuesta.status, respuesta.msg);
          this.mostrarDireccion = false;
          this.direccionService.direcciones.push(respuesta.data as Direccion);
        } else {
          this.openSnackBar(respuesta.status, respuesta.error);
        }
      });
    }
  }

  /**
   * Método que agrega un nuevo usuario
   * @param form 
   */
  agregarUsuario(form ? : NgForm) {
    var validacion: boolean = true;
    var mensaje: string;
    form.value.correo = this.usuarioService.usuarioSeleccionado.correo;
    if (form.value.numeroDocumento == null || form.value.nombres == null || form.value.apellidos == null || form.value.correo == null || form.value.tipoDocumento == null || form.value.fechaNacimiento == null || form.value.sexo == null) {
      mensaje = 'Algunos campos del formulario no estan debidamente completados';
      validacion = false;
    }
    if (form.value.tipoDocumento == 'DNI') {
      var dni: string = form.value.numeroDocumento ? form.value.numeroDocumento : '';
      if (dni.length != 8) {
        validacion = false;
        mensaje = 'El número de documento no es válido, un DNI sólo tiene 8 dígitos.';
      }
    }
    if (validacion) {
      if (form.value._id) {
        this.usuarioService.putUsuario(form.value).subscribe(res => {
          const respuesta = res as Respuesta;
          if (respuesta.status) {
            this.openSnackBar(respuesta.status, respuesta.msg);
            this.resetForm(form);
            this.getUsuarios();
          } else {
            this.openSnackBar(respuesta.status, respuesta.error);
          }
        });
      } else {
        form.value.password = form.value.numeroDocumento;
        this.usuarioService.postUsuario(form.value).subscribe(res => {
          const respuesta = res as Respuesta;
          if (respuesta.status) {
            this.openSnackBar(respuesta.status, respuesta.msg);
            this.getUsuarios();
            this.resetForm(form);
          } else {
            this.openSnackBar(respuesta.status, respuesta.error);
          }
        });
      }
    } else {
      this.openSnackBar(false, mensaje);
    }
  }

  /**
   * Método para filtrar la tabla de datos
   * @param filtro 
   */
  aplicarFiltro(filtro: string){
    this.usuarioDataSource.filter = filtro.trim().toLowerCase();
    if (this.usuarioDataSource.paginator) {
      this.usuarioDataSource.paginator.firstPage();
    }
  }

  /**
   * Método que selecciona un departamento 
   * @param departamento 
   */
  departamento_selected(departamento: string) {
    var i: number = 0;
    while (this.regionService.regiones[i].departamento != departamento) {
      i = i + 1;
    }
    this.regionService.departamentoSelected = this.regionService.regiones[i];
    this.regionService.provinciaSelected = new Provincia(undefined, "", []);
  }

  /**
   * Método que muestra el formulario para editar una dirección
   * @param direccion 
   */
  editarDireccion(direccion: Direccion) {
    this.boton_direccion = "EDITAR DIRECCIÓN";
    this.direccion_header = "MODIFICAR DIRECCIÓN";
    var i = 0;
    while (this.regionService.regiones[i].departamento != direccion.departamento) {
      i++
    }
    this.regionService.departamentoSelected = this.regionService.regiones[i];
    i = 0;
    while (this.regionService.departamentoSelected.provincias[i].provincia != direccion.provincia) {
      i++
    }
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
  getDirecciones(correo: string) {
    this.direccionService.getDirecciones(correo).subscribe(res => {
      this.direccionService.direcciones = res as Direccion[];
      //this.direccionDataSource.data.concat(this.direccionService.direcciones);
      //this.direccionDataSource = new MatTableDataSource<Direccion>(this.direccionService.direcciones);
      //console.log(this.direccionDataSource.data);
      this.direccionDataSource = new MatTableDataSource(this.direccionService.direcciones);
      this.direccionDataSource.paginator = this.dpaginator;
      this.direccionDataSource.sort = this.dsort;
      console.log(this.direccionDataSource.data);
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
    this.usuarioService.getUsuarios().subscribe(res => {
      this.usuarioService.usuarios = res as Usuario[];
      this.usuarioDataSource = new MatTableDataSource(this.usuarioService.usuarios);
      this.usuarioDataSource.paginator = this.upaginator;
      this.usuarioDataSource.sort = this.usort;
      //this.reRender();
    });
  }

  /**
   * Método que obtiene las regiones o departamentos
   */
  getRegiones() {
    this.regionService.getRegiones().subscribe(res => {
      this.regionService.regiones = res as Region[];
    })
  }

  /**
   * Método que muestra el formulario de una nueva dirección
   * @param form 
   * @param usuario 
   */
  nueva_direccion(form ? : NgForm, usuario ? : string) {
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
  nuevo_usuario(form ? : NgForm) {
    this.usuario_header = "NUEVO USUARIO";
    this.boton_accion = "CREAR USUARIO";
    this.mostrarUsuarioForm = true;
    this.mostrarListaUsuarios = false;
    this.mostrarBotonNuevo = false;
    this.mostrarBotonVolver = true;
  }

  /**
   * Método que muestra un Bar temporal para confirmar los mensajes de éxito y de error
   */
  openSnackBar(status: boolean, mensaje: string): void {
    var clase = status ? 'exito' : 'error';
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 3000,
      panelClass: [clase],
      data: mensaje
    });
  }

  /**
   * Método que muestra los distritos de una provincia seleccionada
   * @param provincia 
   */
  provincia_selected(provincia: string) {
    var i: number = 0;
    while (this.regionService.departamentoSelected.provincias[i].provincia != provincia) {
      i = i + 1;
    }
    this.regionService.provinciaSelected = this.regionService.departamentoSelected.provincias[i];
  }

  /**
   * Método que vuelve a cargar el formulario de dirección
   * @param form 
   */
  resetDireccionForm(form ? : NgForm) {
    if (form) {
      this.direccionService.dirSelected = new Direccion();
      form.reset();
    }
  }

  /**
   * Método que vuelve a cargar el formulario de usuario
   * @param form 
   */
  resetForm(form ? : NgForm) {
    if (form) {
      this.usuarioService.usuarioSeleccionado = new Usuario();
      form.reset();
    }
  }

}
