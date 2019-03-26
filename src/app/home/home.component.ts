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
  articulosCartel : Cartel[] = [];
  accesoriosCartel : Cartel[] = [];


  //cartelesEquipos : Cartel[] = [];
  //cartelPlan: Cartel[] = [];
  //cartelesAccesorios: Cartel[] = [];
  imagenSelected : string;
  //mostrarLinea : boolean = false;
  //listaLineas = [];
  //listaTipoPlanes = [];
  //listaCuotas = [];
  listaPreciosFiltro: any[] = new Array();
  listaCarteles : Cartel[];
  listaArticulos: Articulo[] = [];
  //planCardPlan : any;
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
          this.articulosCartel = rspta.data as Cartel[];
          this.accesoriosCartel = rspta.data2 as Cartel[];
        } else {
          this.openSnackBar(rspta.status, rspta.error);
        }
      });
    });
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

  /**
   * Método que verifica si el último artículo agregado tiene la información completa.
   */
  verificarArticulo(): boolean{
    var indice = this.articulosCartel.length - 1;
    if(this.articulosCartel[indice].idEquipo == null && this.articulosCartel[indice].urlImagen == null){
      return false;
    } else {
      return true;
    }
  }

  /**
   * Método para agregar un artículo a la lista de artículos, verificando que los anteriores tengan la información completa.
   */
  agregarArticulo(){
    var verificar = this.articulosCartel.length != 0 ? this.verificarArticulo() : true;
    if( verificar) {
      this.articulosCartel.push(new Cartel());
      this.openSnackBar(true, "Seleccione el artículo y su respectiva imagen.");
    } else {
      this.openSnackBar(false, 'Por favor, complete la información del artículo anterior.');
    }
  }

  /**
   * Método que abre un dialogo para seleccionar una imagen de un artículo o accesorio
   * @param cartel 
   */
  seleccionarImagen(cartel: Cartel){
    const dialogRef = this.dialog.open(SelectImagenComponent, {
      width: '600px',
      panelClass: 'dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      cartel.urlImagen = result;
    });
  }

  /**
   * Método que dado el índice de un artículo permite eliminarlo de la lista de artículos
   * @param indice : índice en la lista del artículo
   */
  eliminarArticulo(indice: number){
    if(this.articulosCartel[indice]._id){
      this.articuloService.eliminarCartel(this.articulosCartel[indice]._id).subscribe( res => {
        var rspta = res as Respuesta;
        rspta.status ? this.openSnackBar(rspta.status, rspta.msg) : this.openSnackBar(rspta.status, rspta.error);
      });
    }  else {
      this.openSnackBar(true, 'El artículo se eliminó de la lista de artículos');
    }
    this.articulosCartel.splice(indice, 1);
  }

  /**
   * Método que seleccionar un artículo y completa su información como tipo y lo activa.
   * @param cartel : objeto donde se guarda la información del artículo
   * @param idEquipo : identificador del equipo
   */
  seleccionarArticulo(cartel: Cartel, idEquipo: string){
    cartel.idEquipo = idEquipo;
    cartel.activo = true;
    cartel.tipo = 'ARTICULO';
  }

  /**
   * Método que permite almacenar en la base de datos la información de los artículos
   */
  guardarArticulos(){
    this.articuloService.postCarteles(this.articulosCartel).subscribe( res => {
      var rspta = res as Respuesta;
      rspta.status ? this.openSnackBar(rspta.status, rspta.msg) : this.openSnackBar(rspta.status, rspta.error) ;
    });
  }

  /**
   * Método que verifica si un accesorio tiene la información completa
   */
  verificarAccesorio(): boolean{
    var indice = this.accesoriosCartel.length - 1;
    if(this.accesoriosCartel[indice].idEquipo == null && this.accesoriosCartel[indice].urlImagen == null){
      return false;
    } else {
      return true;
    }
  }

  /**
   * Método que permite agregar un accesorio a la lista de accesorios
   */
  agregarAccesorio() {
    var verificar = this.accesoriosCartel.length != 0 ? this.verificarAccesorio() : true;
    if( verificar) {
      this.accesoriosCartel.push(new Cartel());
      this.openSnackBar(true, "Seleccione el accesorio y su respectiva imagen.");
    } else {
      this.openSnackBar(false, 'Por favor, complete la información del accesorio anterior.');
    }
  }

  /**
   * Método que permite eliminar un accesorio de la lista de accesorios
   * @param indice : índice del accesorio
   */
  eliminarAccesorio(indice: number) {
    if(this.accesoriosCartel[indice]._id){
      this.articuloService.eliminarCartel(this.accesoriosCartel[indice]._id).subscribe( res => {
        var rspta = res as Respuesta;
        rspta.status ? this.openSnackBar(rspta.status, rspta.msg) : this.openSnackBar(rspta.status, rspta.error);
      });
    } else {
      this.openSnackBar(true, 'El accesorio se ha eliminado de la lista de accesorios.')
    }
    this.accesoriosCartel.splice(indice, 1);
  }

  /**
   * Método que permite completar el equipo de un accesorio
   * @param accesorio : objeto del accesorio
   * @param idEquipo : identificador del equipo de tipo accesorio
   */
  seleccionarAccesorio(accesorio: Cartel, idEquipo: string){
    accesorio.idEquipo = idEquipo;
    accesorio.activo = true;
    accesorio.tipo = "ACCESORIO";
  }

  /**
   * Método que permite guardar la lista de accesorios
   */
  guardarAccesorios(){
    this.articuloService.postCarteles(this.accesoriosCartel).subscribe( res => {
      var rspta = res as Respuesta;
      rspta.status ? this.openSnackBar(rspta.status, rspta.msg) : this.openSnackBar(rspta.status, rspta.error) ;
    });
  }
}
