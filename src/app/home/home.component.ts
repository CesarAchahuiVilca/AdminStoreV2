import { Component, OnInit } from '@angular/core';
import { Miga } from '../miga';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ImagenCartelComponent } from './imagen-cartel/imagen-cartel.component';
import { ArticuloService } from '../articulo/articulo.service';
import { Articulo } from '../articulo/articulo';
import { SelectImagenComponent } from './select-imagen/select-imagen.component';
import { Respuesta } from '../usuario/respuesta';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { Constantes } from '../constantes';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Banner, ArticuloBanner } from './banner';

export class Cartel {
  _id: string;
  idEquipo: string;
  urlImagen: string;
  tipo: string;
  activo: boolean;
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
  listaimagenesfiltro           : string[];
  listaimagenes          : string[];
  readonly URL_IMAGES                             = Constantes.URL_IMAGENES;
  imagenesSeleccionadas   : string[] = new Array();
  selectedFile            : File                  = null;
  readonly URL_API                                = Constantes.URL_API_IMAGEN + '/subir';
  indexBannerSelected = 0;
  // DATOS DEL BANNER
  banners: any[]  = new Array();

  constructor( public http: HttpClient, public dialog: MatDialog, public articuloService: ArticuloService, public snackBar: MatSnackBar) { }
  
  ngOnInit() {
    // Obtener todos los artículos con registro completo
    this.articuloService.getArticulos().subscribe( res => {
      this.articuloService.listaArticulos = res as Articulo[];
      // Obtener los cartéles vigentes
      this.articuloService.getCarteles().subscribe( res => {
        const rspta = res as Respuesta;
        if(rspta.status){
          this.openSnackBar(rspta.status, rspta.msg);
          this.listaCarteles = rspta.data as Cartel[];
        } else {
          this.openSnackBar(rspta.status, rspta.error);
          console.log(rspta.data);
        }
      });
    });

    /**
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
    });*/
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
    ];
    this.getListaBanners();
  }
  
  getListaImagenes(indice){
    this.indexBannerSelected = indice;
    this.articuloService.getImagenes()
      .subscribe(res=>{
        console.log(res);
        this.listaimagenes = res as string[];
        this.listaimagenesfiltro = this.listaimagenes;
      });
  }

  buscaNuevaImagen(){
    document.getElementById("imageninput").click();
  }
  
  buscarImagenesFiltro(event){
    var input  = document.getElementById("input-busqueda-imagenes-articulo") as HTMLInputElement;
    //this.pararbusquedaanterior = true;
      this.listaimagenesfiltro = new Array();
      for(var i=0;i<this.listaimagenes.length;i++){
        var inputcheck = document.getElementById(this.listaimagenes[i]+"itemimg") as HTMLDivElement;
        if(this.listaimagenes[i].includes(input.value)){
          inputcheck.hidden = false;
        }else{
          inputcheck.hidden = true;
        }
      }  
  }
  agregarImagenesArticulo(nombre: string){
    this.banners[this.indexBannerSelected].imagen = nombre;
  }

  eliminarItemImagen(id:string){
    this.listaimagenesfiltro = this.listaimagenes;
    for(var i=0;i<this.imagenesSeleccionadas.length;i++){
      if(this.imagenesSeleccionadas[i] == id){
        this.imagenesSeleccionadas.splice(i,1);
        var inputcheck = document.getElementById(id) as HTMLInputElement;
        inputcheck.checked = false;
        //console.log(inputcheck);
        //console.log(id);
      }else{
        var inputcheck = document.getElementById(id) as HTMLInputElement;
        inputcheck.checked = true;
      }
    }
  }

  // FUNCIONES DEL BANNER
  //======================================================================
  getListaBanners(){
    this.articuloService.getBanners()
      .subscribe(res=>{
        this.banners = res as Banner[];
      });
  }
  agregarBanner(){
    this.banners.push(new Banner())
  }
  eliminarItemBanner(i){
    this.banners.splice(i,1);
  }
  listaequiposbanner: any[] = new Array();
  listaequiposbannerfiltro: any[] = new Array();
  getListaEquipos(indice){
    this.indexBannerSelected = indice;
    this.banners[this.indexBannerSelected].articulos = new Array();
    //if(this.listaequiposbanner.length==0){
      this.articuloService.getArticulos()
      .subscribe(res=>{
        this.listaequiposbanner = res as string[];
        //this.listaequiposbannerfiltro = this.listaequiposbanner;
      });
    //}
    
  }
  agregararticuloBanner(arti){
    var existe = false;
    for(var i=0;i<this.banners[this.indexBannerSelected].articulos.length;i++){
      if(this.banners[this.indexBannerSelected].articulos[i].titulo == arti.titulo){
        this.banners[this.indexBannerSelected].articulos.splice(i,1);
        existe = true;     
      }
    }
    if(!existe){
      var articulo = {
        idarticulo: arti._id,
        url: arti.url,  
        titulo: arti.titulo,
        categoria:arti.categoria,
        idprecio:arti.idprecio,
        cantidad:arti.cantidad,
        imagenes: arti.imagenes,
        precioplan:null,
      }
      this.banners[this.indexBannerSelected].articulos.push(articulo);
    }
  }

  guardarBanners(){
    this.articuloService.postBanners(this.banners).subscribe(res=>{
      var rspta = res as Respuesta;
      console.log(res);
      if(rspta.status){
        this.openSnackBar(rspta.status, rspta.msg);
      } else {
        this.openSnackBar(rspta.status, rspta.error);
      }
    })

  }

  //======================================================================

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
    //this.buscarPlanes(this.cartelPlan[0].idPrecio, this.cartelPlan[0].linea, this.cartelPlan[0].tipoPlan, this.cartelPlan[0].cuotas);
    var i = 0 ;
    //while( i < this.listaPreciosFiltro.length && this.cartelPlan[0].plan != this.listaPreciosFiltro[i].nombreplan){ i++; }
    this.planCardPlan = this.listaPreciosFiltro[i];
    console.log(this.planCardPlan);
  }

  subirImagen(){
    this.dialog.open(ImagenCartelComponent, {
      width: '600px',
      panelClass: 'dialog'
    });
  }

  subirImagen2(evento){
    this.selectedFile  = <File> evento.target.files[0];
    //evento.preventDefault();
    let headers = new Headers();
    headers.append('Content-Type','multipart/form-data');
    headers.append('nombre','nuevonombre.webp');
    const fd = new FormData();
   
    fd.append('image',this.selectedFile, this.selectedFile.name);
    this.http.post(this.URL_API,fd,{      
      reportProgress: true,
      observe: 'events'
    })
    .subscribe(event=>{
        if(event.type === HttpEventType.UploadProgress){
          console.log("Subiendo "+ Math.round(event.loaded/event.total*100)+" %");
          /*progreso.style.width = Math.round(event.loaded/event.total*100)+"%";
          progreso.innerHTML = "Subiendo "+ Math.round(event.loaded/event.total*100)+" %";
          inputfile.style.display="none";*/
          if(Math.round(event.loaded/event.total*100) == 100){
            console.log("termino subir la imagen");
            console.log("Comprimiendo imagen");
          /*  progreso.innerHTML = "Comprimiendo Imagen....";
            inputfile.innerHTML = "";*/
          }     
        }else{
          if(event.type === HttpEventType.Response){
            //console.log(event.body);       
            this.getListaImagenes(0); 
          }
        }
      }
    );
  }

  /**
   * Método para buscar los planes de un determinado artículo
   * @param idPrecio : identificador del precio de venta
   * @param tipoLinea : tipo de linea del precio
   * @param tipoPlan : tipo plan seleccionado
   * @param tipoCuota : cantidad de cuotas seleccionadas
   */
  buscarPlanes(idPrecio: string, tipoLinea: string, tipoPlan: string, tipoCuota: string){
    this.articuloService.getPreciosArticulo(idPrecio, tipoLinea, tipoPlan, tipoCuota).subscribe( res => {
      this.listaPreciosFiltro = res as any[];
    });
  }

  /**
   * Método para seleccionar un cartél de equipo
   * @param i : indice del artículo
   * @param evento : objeto de tipo artículo
   */
  seleccionarCard(i: number, evento: any){
    var indice : number = i;
    this.cartelesEquipos[indice].idEquipo = evento._id;
    this.cartelesEquipos[indice].tipo = 'Equipo';
    //this.cartelesEquipos[indice].link = evento.url;
    this.cartelesEquipos[indice].activo = true;
    //this.cartelesEquipos[indice].titulo = evento.titulo
    //this.cartelesEquipos[indice].idPrecio = evento.idprecio;
  }

  /**
   * Método par agregar un cartel con plan
   * @param articulo : objeto de tipo artículo
   */
  seleccionarCardPlan(articulo: any){
    this.cartelPlan[0].idEquipo = articulo._id;
    //this.cartelPlan[0].link = articulo.url;
    this.cartelPlan[0].tipo = 'Plan';
    this.cartelPlan[0].activo = true;
    //this.cartelPlan[0].idPrecio = articulo.idprecio;
    //this.cartelPlan[0].titulo = articulo.titulo;
  }

  /**
   * Método para agregar un accesorio en el menú
   * @param j : indice del accesorio
   * @param accesorio : objeto del tipo accesorio
   */
  seleccionarAccesorio(j: number, accesorio: any){
    this.cartelesAccesorios[j].idEquipo = accesorio._id;
    this.cartelesAccesorios[j].tipo = 'Accesorio';
    this.cartelesAccesorios[j].activo= true;
    //this.cartelesAccesorios[j].link = accesorio.url;
    //this.cartelesAccesorios[j].titulo = accesorio.titulo;
    //this.cartelesAccesorios[j].idPrecio = accesorio.idprecio;
  }

  /**
   * Método para seleccionar la linea de producto a vender
   * @param linea : nombre de la linea de producto
   */
  seleccionarLinea(linea: string){
    console.log(this.cartelPlan[0]);
    //this.cartelPlan[0].linea = linea;
    /*if(this.cartelPlan[0].linea == 'PREPAGO'){
      this.cartelPlan[0].tipoPlan = 'ALTA';
      this.cartelPlan[0].cuotas = '0';
      this.cartelPlan[0].plan = null;
      this.buscarPlanes(this.cartelPlan[0].idPrecio, this.cartelPlan[0].linea, this.cartelPlan[0].tipoPlan, this.cartelPlan[0].cuotas);
    }*/
  }

  /**
   * Método para seleccionar un tipo de plan 
   * @param tipoPlan : tipo plan seleccionado
   */
  seleccionarTipoPlan(tipoPlan: string){
    //this.cartelPlan[0].tipoPlan = tipoPlan;
    //this.cartelPlan[0].plan = null;
    //this.buscarPlanes(this.cartelPlan[0].idPrecio, this.cartelPlan[0].linea, this.cartelPlan[0].tipoPlan, "0");
  }

  /**
   * Método para seleccionar cuotas de un plan
   * @param cuota : cantidad de cuotas a mostrar
   */
  seleccionarCuota(cuota: string){
    //this.cartelPlan[0].cuotas = cuota;
    //this.cartelPlan[0].plan = null;
    //this.buscarPlanes(this.cartelPlan[0].idPrecio, this.cartelPlan[0].linea, this.cartelPlan[0].tipoPlan, this.cartelPlan[0].cuotas);
  }

  /**
   * Método para seleccionar un plan
   * @param plan 
   */
  seleccionarPlan(plan: string){
    //this.cartelPlan[0].plan = plan;
  }

  /**
   * Método que muestra las imagenes disponibles de un artículo para escoger la que se mostrará en portada
   * @param indice : indice del cartél
   */
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

  /**
   * Método que guarda la información relacionada a los carteles
   */
  guardarCarteles(){
    var carteles : Cartel[] = [];
    carteles = carteles.concat(this.cartelesEquipos, this.cartelPlan, this.cartelesAccesorios);
    /*for(var i= 0; i < carteles.length; i++){
      carteles[i].orden = i;
    }*/
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
   * Método que muestra un bar temporal para confirmar un mensaje
   * @param status : tipo de mensaje a mostrar
   * @param mensaje : contenido del mensaje a mostrar
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
