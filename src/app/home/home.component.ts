import { Component, OnInit } from '@angular/core';
import { Miga } from '../miga';
import { MatDialog } from '@angular/material';
import { ImagenCartelComponent } from './imagen-cartel/imagen-cartel.component';
import { ArticuloService } from '../articulo/articulo.service';
import { Articulo } from '../articulo/articulo';
import { SelectImagenComponent } from './select-imagen/select-imagen.component';

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

  constructor(public dialog: MatDialog, public articuloService: ArticuloService) { }

  ngOnInit() {
    this.articuloService.getArticulos().subscribe( res => {
      this.articuloService.listaArticulos = res as Articulo[];
    });
    this.cartelesEquipos.length = 6;
    for(var i = 0; i < this.cartelesEquipos.length; i++){
      this.cartelesEquipos[i] = new Cartel();
    }
    this.cartelPlan.length = 1;
    this.cartelPlan[0] = new Cartel();
    this.cartelesAccesorios.length = 2;
    this.cartelesAccesorios[0] = new Cartel();
    this.cartelesAccesorios[1] = new Cartel();
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

  subirImagen(){
    const dialogRef = this.dialog.open(ImagenCartelComponent, {
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
  }

  seleccionarCardPlan(articulo: any){
    this.cartelPlan[0].idEquipo = articulo._id;
    this.cartelPlan[0].link = articulo.url;
    this.cartelPlan[0].tipo = 'Plan';
    this.cartelPlan[0].activo = true;
    this.cartelPlan[0].idPrecio = articulo.idprecio;
  }

  seleccionarAccesorio(j: number, accesorio: any){
    this.cartelesAccesorios[j].idEquipo = accesorio._id;
    this.cartelesAccesorios[j].tipo = 'Accesorio';
    this.cartelesAccesorios[j].activo= true;
    this.cartelesAccesorios[j].link = accesorio.url;
  }

  seleccionarLinea(linea: string){
    console.log(this.cartelPlan[0]);
    this.cartelPlan[0].linea = linea;
    if(this.cartelPlan[0].linea == 'PREPAGO'){
      this.cartelPlan[0].tipoPlan = 'ALTA';
      this.cartelPlan[0].cuotas = '0';
      this.cartelPlan[0].plan = null;
      this.buscarPlanes(this.cartelPlan[0].idPrecio, this.cartelPlan[0].linea, this.cartelPlan[0].tipoPlan, this.cartelPlan[0].cuotas);
      console.log(this.listaPreciosFiltro);
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
    this.articuloService.postCarteles(carteles).subscribe(res => {
      console.log(res);
    });
  }

}
