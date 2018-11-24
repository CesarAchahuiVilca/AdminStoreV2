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
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { CaracteristicasComponent } from './caracteristicas/caracteristicas.component';
import { DetallemarcaComponent } from './detallemarca/detallemarca.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { RegionComponent } from './region/region.component';
import { ArticuloComponent } from './articulo/articulo.component';
import { DataTablesModule } from 'angular-datatables';
import { DistribuidorComponent } from './distribuidor/distribuidor.component';
import { PedidosComponent } from './pedidos/pedidos.component';


const routes: Route[] = [
  {path: 'marca', component: MarcadistriComponent},
  {path: 'login', component: LoginComponent},
  {path: 'categoria', component: CategoriaComponent},
  {path: 'caracteristicas', component: CaracteristicasComponent},
  {path: 'usuarios', component: UsuarioComponent},
  {path: 'region', component: RegionComponent},
  {path: 'articulos', component: ArticuloComponent},
  {path: 'distribuidor',component: DistribuidorComponent},
  {path: 'pedidos',component:PedidosComponent},
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
    PedidosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    NgFlashMessagesModule.forRoot(),
    HttpClientModule,
    DataTablesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
