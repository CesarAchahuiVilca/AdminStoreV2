import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { MarcadistriComponent } from './marcadistri/marcadistri.component';
import { RouterModule, Route } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CategoriaComponent } from './categoria/categoria.component';

const routes: Route[] = [
  {path: 'marca', component: MarcadistriComponent},
  {path: 'login', component: LoginComponent},
  {path: 'categoria', component: CategoriaComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    BreadcrumbComponent,
    MarcadistriComponent,
    LoginComponent,
    CategoriaComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
