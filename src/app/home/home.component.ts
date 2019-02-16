import { Component, OnInit } from '@angular/core';
import { Miga } from '../miga';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ImagenCartelComponent } from './imagen-cartel/imagen-cartel.component';
import { ArticuloService } from '../articulo/articulo.service';
import { Articulo } from '../articulo/articulo';
import { SelectImagenComponent } from './select-imagen/select-imagen.component';
import { Respuesta } from '../usuario/respuesta';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';

export class Cartel {
  _id: string;
  idEquipo: string;
  urlImagen: string;
  tipo: string;
  link: string;
  activo: boolean;
  linea: string;
  tipoPlan: string;
  cuotas: string;
  plan: string;
  idPrecio: string;
  orden: number;
  titulo: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public migas = [ new Miga('Imágenes del Menú Principal','/home')];
  cartelesEquipos : Cartel[] = [];
  cartelPlan: Cartel[] = [];
  cartelesAccesorios: Cartel[] = [];
  imagenSelected : string;
  mostrarLinea : boolean = false;
  listaLineas = [];
  listaTipoPlanes = [];
  listaCuotas = [];
  listaPreciosFiltro: any[] = new Array();
  listaCarteles : Cartel[];
  listaArticulos: Articulo[] = [];
  planCardPlan : any;

  constructor(public dialog: MatDialog, public articuloService: ArticuloService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.articuloService.getArticulos().subscribe( res => {
      this.articuloService.listaArticulos = res as Articulo[];
      this.articuloService.getCarteles().subscribe( res => {
        const rspta = res as Respuesta;
        if(rspta.status){
          if(rspta.data.length == 0){
            this.openSnackBar(rspta.status, rspta.msg);
            this.cartelesEquipos.length = 6;
            for(var i = 0; i < this.cartelesEquipos.length; i++){
              this.cartelesEquipos[i] = new Cartel();
            }
            this.cartelPlan.length = 1;
            this.cartelPlan[0] = new Cartel();
            this.cartelesAccesorios.length = 2;
            this.cartelesAccesorios[0] = new Cartel();
            this.cartelesAccesorios[1] = new Cartel();
          } else {
            this.listaCarteles = rspta.data as Cartel[];
            this.completarRegistros(this.listaCarteles);
            this.openSnackBar(rspta.status, rspta.msg);
          }
        } else  {
          this.openSnackBar(rspta.status, rspta.error);
          this.cartelesEquipos.length = 6;
          for(var i = 0; i < this.cartelesEquipos.length; i++){
            this.cartelesEquipos[i] = new Cartel();
          }
          this.cartelPlan.length = 1;
          this.cartelPlan[0] = new Cartel();
          this.cartelesAccesorios.length = 2;
          this.cartelesAccesorios[0] = new Cartel();
          this.cartelesAccesorios[1] = new Cartel();
        }
      });
    });
    // Lista de lineas y planes existentes
    this.listaLineas = [{ valor: "PREPAGO", nombre: "Prepago" }, { valor: "POSTPAGO", nombre: "Postpago" }];
    this.listaTipoPlanes = [
      { valor: "ALTA", nombre: "Linea Nueva" },
      { valor: "PORTABILIDAD", nombre: "Portabilidad" },
      { valor: "RENOVACION", nombre: "Renovación" },
      { valor: "PORTABILIDAD EXCLUSIVA", nombre: "Portabilidad Especial" },
      { valor: "RENOVACION EXCLUSIVA", nombre: "Renovación Especial" }
    ];
    this.listaCuotas = [
      { valor: "0", nombre: "Sin Cuotas" },
      { valor: "12", nombre: "12 Cuotas" },
      { valor: "18", nombre: "18 Cuotas" }
    ]
  }

  completarRegistros(carteles: Cartel[]){
    this.cartelesEquipos = carteles.slice(0,6);
    this.cartelPlan = carteles.slice(6,7);
    this.cartelesAccesorios = carteles.slice(7,9);
    for(var i = 0; i < carteles.length; i++){
      var j = 0;
      while((j < this.articuloService.listaArticulos.length) && (this.articuloService.listaArticulos[j]._id != carteles[i].idEquipo)){
        j++;
      }
      this.listaArticulos.push(this.articuloService.listaArticulos[j]);
    }
    console.log(this.cartelPlan);
    this.buscarPlanes(this.cartelPlan[0].idPrecio, this.cartelPlan[0].linea, this.cartelPlan[0].tipoPlan, this.cartelPlan[0].cuotas);
    var i = 0 ;
    while( i < this.listaPreciosFiltro.length && this.cartelPlan[0].plan != this.listaPreciosFiltro[i].nombreplan){ i++; }
    this.planCardPlan = this.listaPreciosFiltro[i];
    console.log(this.planCardPlan);
  }

  subirImagen(){
    this.dialog.open(ImagenCartelComponent, {
      width: '600px',
      panelClass: 'dialog'
    });
  }

  buscarPlanes(idPrecio: string, tipoLinea: string, tipoPlan: string, tipoCuota: string){
    this.articuloService.getPreciosArticulo(idPrecio, tipoLinea, tipoPlan, tipoCuota).subscribe( res => {
      this.listaPreciosFiltro = res as any[];
    });
  }

  seleccionarCard(i: number, evento: any){
    var indice : number = i;
    this.cartelesEquipos[indice].idEquipo = evento._id;
    this.cartelesEquipos[indice].tipo = 'Equipo';
    this.cartelesEquipos[indice].link = evento.url;
    this.cartelesEquipos[indice].activo = true;
    this.cartelesEquipos[indice].titulo = evento.titulo
    this.cartelesEquipos[indice].idPrecio = evento.idprecio;
  }

  seleccionarCardPlan(articulo: any){
    this.cartelPlan[0].idEquipo = articulo._id;
    this.cartelPlan[0].link = articulo.url;
    this.cartelPlan[0].tipo = 'Plan';
    this.cartelPlan[0].activo = true;
    this.cartelPlan[0].idPrecio = articulo.idprecio;
    this.cartelPlan[0].titulo = articulo.titulo;
  }

  seleccionarAccesorio(j: number, accesorio: any){
    this.cartelesAccesorios[j].idEquipo = accesorio._id;
    this.cartelesAccesorios[j].tipo = 'Accesorio';
    this.cartelesAccesorios[j].activo= true;
    this.cartelesAccesorios[j].link = accesorio.url;
    this.cartelesAccesorios[j].titulo = accesorio.titulo;
    this.cartelesAccesorios[j].idPrecio = accesorio.idprecio;
  }

  seleccionarLinea(linea: string){
    console.log(this.cartelPlan[0]);
    this.cartelPlan[0].linea = linea;
    if(this.cartelPlan[0].linea == 'PREPAGO'){
      this.cartelPlan[0].tipoPlan = 'ALTA';
      this.cartelPlan[0].cuotas = '0';
      this.cartelPlan[0].plan = null;
      this.buscarPlanes(this.cartelPlan[0].idPrecio, this.cartelPlan[0].linea, this.cartelPlan[0].tipoPlan, this.cartelPlan[0].cuotas);
    }
  }

  seleccionarTipoPlan(tipoPlan: string){
    this.cartelPlan[0].tipoPlan = tipoPlan;
    this.cartelPlan[0].plan = null;
    this.buscarPlanes(this.cartelPlan[0].idPrecio, this.cartelPlan[0].linea, this.cartelPlan[0].tipoPlan, "0");
  }

  seleccionarCuota(cuota: string){
    this.cartelPlan[0].cuotas = cuota;
    this.cartelPlan[0].plan = null;
    this.buscarPlanes(this.cartelPlan[0].idPrecio, this.cartelPlan[0].linea, this.cartelPlan[0].tipoPlan, this.cartelPlan[0].cuotas);
  }

  seleccionarPlan(plan: string){
    this.cartelPlan[0].plan = plan;
  }

  seleccionarImagen(indice: number){
    const dialogRef = this.dialog.open(SelectImagenComponent, {
      width: '600px',
      panelClass: 'dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(indice < 6){
        this.cartelesEquipos[indice].urlImagen = result;
      } else if (indice == 6){
        this.cartelPlan[0].urlImagen = result;
      } else {
        this.cartelesAccesorios[indice - 7].urlImagen = result;
      }
    });
  }

  guardarCarteles(){
    var carteles : Cartel[] = [];
    carteles = carteles.concat(this.cartelesEquipos, this.cartelPlan, this.cartelesAccesorios);
    for(var i= 0; i < carteles.length; i++){
      carteles[i].orden = i;
    }
    console.log(carteles);
    this.articuloService.postCarteles(carteles).subscribe(res => {
      var rspta = res as Respuesta;
      if(rspta.status){
        this.openSnackBar(rspta.status, rspta.msg);
      } else {
        this.openSnackBar(rspta.status, rspta.error);
      }
    });
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

}
