import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { DireccionService } from './direccion.service';
import { NgForm } from '@angular/forms';
import { NgFlashMessageService } from 'ng-flash-messages';
import { Usuario } from './usuario';
import { Direccion } from './direccion';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  providers: [ UsuarioService ]
})
export class UsuarioComponent implements OnInit {

  private boton_accion : string;
  private usuario_header : string;
  private direccion_header : string;

  constructor(
    private usuarioService : UsuarioService,
    private flashMessage : NgFlashMessageService,
    private direccionService : DireccionService
    ) { }

  ngOnInit() {
    document.getElementById('btnDireccion').hidden = true;
    this.getUsuarios();
  }

  agregarDireccion(form?: NgForm){
    console.log(form.value);
  }

  agregarUsuario(form?: NgForm) {
    if(form.value._id) {
      this.usuarioService.putUsuario(form.value)
        .subscribe(res => {
          var jres = JSON.parse(JSON.stringify(res));
          this.resetForm(form);
          this.getUsuarios();
          //M.toast({html: 'Updated Successfully'});
        });
    } else {
      form.value.password = form.value.numeroDocumento;
      this.usuarioService.postUsuario(form.value)
      .subscribe(res => {
        var jres = JSON.parse(JSON.stringify(res));
        if(jres.exito){
          this.flashMessage.showFlashMessage({messages: ['Usuario creado con éxito'], timeout: 5000, dismissible: true, type: 'success'});
          this.getUsuarios();
          this.resetForm(form);
        } else {
          this.flashMessage.showFlashMessage({messages: ['El correo electrónico usado ya existe'], timeout: 5000,dismissible: true, type: 'danger'});
        }
      });
    }
    
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
    this.direccionService.getDirecciones().subscribe( res => {
      this.direccionService.direcciones = res as Direccion[];
    })
  }

  eliminarUsuario(_id: string, form: NgForm) {
    if(confirm('Are you sure you want to delete it?')) {
      this.usuarioService.deleteUsuario(_id)
        .subscribe(res => {
          this.getUsuarios();
          this.resetForm(form);
          //M.toast({html: 'Deleted Succesfully'});
        });
    }
  }

  resetForm(form?: NgForm) {
    if (form) {  
      this.usuarioService.usuarioSeleccionado = new Usuario();
      form.reset();
    }
  }

  nueva_direccion(form?: NgForm){
    this.resetForm(form);
    this.direccion_header = "NUEVA DIRECCIÓN";
    document.getElementById('direccion').hidden = false;
  }

  nuevo_usuario(form?: NgForm){
    this.resetForm(form);
    this.usuario_header = "NUEVO USUARIO";
    this.boton_accion = "Crear Usuario";
    document.getElementById('nuevo_usuario').hidden = false;
    document.getElementById('lista_usuarios').hidden = true;
    document.getElementById('limpiar').hidden = false;
    document.getElementById('nuevo').hidden = true;
    document.getElementById('volver').hidden = false;
    
  }
}
