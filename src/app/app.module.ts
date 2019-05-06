import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { MarcadistriComponent } from './marcadistri/marcadistri.component';
import { RouterModule, Route } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { HttpClientModule } from '@angular/common/http';
import { CaracteristicasComponent } from './caracteristicas/caracteristicas.component';
import { DetallemarcaComponent } from './detallemarca/detallemarca.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { RegionComponent } from './region/region.component';
import { ArticuloComponent } from './articulo/articulo.component';
import { DataTablesModule } from 'angular-datatables';
import { DistribuidorComponent } from './distribuidor/distribuidor.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { QuillModule } from 'ngx-quill';
import { ServicioClienteComponent } from './servicio-cliente/servicio-cliente.component';
import { MatMomentDateModule, MomentDateModule } from '@angular/material-moment-adapter';
import { TiendaComponent } from './tienda/tienda.component';
import { PreciosComponent } from './precios/precios.component';
import { PlanesComponent } from './planes/planes.component';
import { SesionComponent } from './sesion/sesion.component';
import { PrincipalComponent } from './principal/principal.component';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { DialogoComponent } from './dialogo/dialogo.component';
import { HomeComponent } from './home/home.component';
import { ImagenCartelComponent } from './home/imagen-cartel/imagen-cartel.component';
import { SelectImagenComponent } from './home/select-imagen/select-imagen.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { CargoComponent } from './cargo/cargo.component';
import { DialogoCargoComponent } from './cargo/dialogo-cargo/dialogo-cargo.component';
import { ArchivosComponent } from './archivos/archivos.component';

const routes: Route[] = [
  {path: '', component: LoginComponent},
  {path: 'articulos', component: ArticuloComponent},
  {path: 'caracteristicas', component: CaracteristicasComponent},
  {path: 'categoria', component: CategoriaComponent},
  {path: 'distribuidor',component: DistribuidorComponent},
  {path: 'locales', component: TiendaComponent},
  {path: 'marca', component: MarcadistriComponent},
  {path: 'menu', component: PrincipalComponent},
  {path: 'pedidos',component:PedidosComponent},
  {path: 'planes', component: PlanesComponent},
  {path: 'precios', component: PreciosComponent},
  {path: 'region', component: RegionComponent},
  {path: 'servicio-cliente',component:ServicioClienteComponent},
  {path: 'usuarios', component: UsuarioComponent},
  {path: 'imagenes-inicio', component: HomeComponent},
  {path: 'seguimiento', component:SeguimientoComponent},
  {path: 'cargos', component: CargoComponent},
  {path: 'archivos', component: ArchivosComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    BreadcrumbComponent,
    MarcadistriComponent,
    LoginComponent,
    CategoriaComponent,
    CaracteristicasComponent,
    DetallemarcaComponent,
    UsuarioComponent,
    RegionComponent,
    ArticuloComponent,
    DistribuidorComponent,
    PedidosComponent,
    ServicioClienteComponent,
    TiendaComponent,
    PreciosComponent,
    PlanesComponent,
    SesionComponent,
    PrincipalComponent,
    SnackBarComponent,
    DialogoComponent,
    HomeComponent,
    ImagenCartelComponent,
    SelectImagenComponent,
    SeguimientoComponent,
    CargoComponent,
    DialogoCargoComponent,
    ArchivosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    DataTablesModule,
    QuillModule,
    MomentDateModule,
    MatMomentDateModule, 
    ScrollDispatchModule
  ],
  entryComponents: [
    SnackBarComponent, 
    DialogoComponent, 
    ImagenCartelComponent, 
    SelectImagenComponent, 
    DialogoCargoComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
