import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { MarcadistriComponent } from './marcadistri/marcadistri.component';
import { RouterModule, Route } from '@angular/router';

const routes: Route[] = [
  {path: 'marca', component: MarcadistriComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    BreadcrumbComponent,
    MarcadistriComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
