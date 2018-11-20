import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { DireccionService } from './direccion.service';
import { NgForm } from '@angular/forms';
import { NgFlashMessageService } from 'ng-flash-messages';
import { Usuario } from './usuario';
import { Direccion } from './direccion';
import { RegionService } from '../region/region.service';
import { Region } from '../region/region';
import { Provincia } from '../region/provincia';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  providers: [ UsuarioService ]
})

export class UsuarioComponent implements OnInit {

  private boton_accion : string;
  private boton_direccion : string;
  private usuario_header : string;
  private direccion_header : string;
  private tiposDocumento : string[];
  
  constructor(
    private usuarioService : UsuarioService,
    private flashMessage : NgFlashMessageService,
    private direccionService : DireccionService,
    private regionService : RegionService
    ) { }

  ngOnInit() {  
    this.tiposDocumento = ['DNI'];
    document.getElementById('btnDireccion').hidden = true;
    this.getUsuarios();
  }

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

  departamento_selected(departamento : string){
    console.log(departamento);
    var i : number = 0;
    while(this.regionService.regiones[i].departamento != departamento){
      i = i + 1;
    }
    this.regionService.departamentoSelected = this.regionService.regiones[i];
  }

  editarDireccion(direccion : Direccion){
    this.boton_direccion = "Editar dirección";
    this.direccion_header = "MODIFICAR DIRECCIÓN";
    this.direccionService.dirSelected = direccion;
    document.getElementById('direccion').hidden = false;
  }

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

  getDirecciones(correo : string) {
    this.direccionService.getDirecciones(correo).subscribe(res => {
      this.direccionService.direcciones = res  as Direccion[];
    })
  }

  getUsuarios() {
    document.getElementById('nuevo_usuario').hidden = true;
    document.getElementById('lista_usuarios').hidden = false;
    document.getElementById('volver').hidden = true;
    document.getElementById('nuevo').hidden = false;
    document.getElementById('direccion').hidden = true;
    document.getElementById('lista_direcciones').hidden = true;
    this.usuarioService.getUsuarios().subscribe( res => {
      this.usuarioService.usuarios = res as Usuario[];
    });
  }

  getRegiones(){
    this.regionService.getRegiones().subscribe(res => {
      this.regionService.regiones = res as Region[];
    })
  }

  nueva_direccion(form?: NgForm, usuario? : string){
    this.resetDireccionForm(form);
    this.direccion_header = "NUEVA DIRECCIÓN";
    this.boton_direccion = "Guardar nueva dirección";
    document.getElementById('direccion').hidden = false;
    this.direccionService.dirSelected.usuario = usuario;
    this.getRegiones();
  }

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

  provincia_selected(provincia: string){
    var i : number = 0;
    while(this.regionService.departamentoSelected.provincias[i].provincia != provincia){
      i = i + 1;
    }
    this.regionService.provinciaSelected = this.regionService.departamentoSelected.provincias[i];
  }

  resetDireccionForm(form?: NgForm) {
    if(form) {
      this.direccionService.dirSelected = new Direccion();
      form.reset();
    }
  }

  resetForm(form?: NgForm) {
    if (form) {  
      this.usuarioService.usuarioSeleccionado = new Usuario();
      form.reset();
    }
  }

}

/*class Provincia{
  constructor(nombre, distritos){
    this.nombre = nombre;
    this.distritos = distritos;
  }
  
  nombre : string;
  distritos : string[];
  
}

class Departamento {
  constructor(nombre, provincias){
    this.nombre = nombre;
    this.provincias = provincias;
  }

  nombre : string;
  provincias : Provincia[];
} */
