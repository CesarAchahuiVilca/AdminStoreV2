import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar} from '@angular/material';
import { Articulo } from './articulo';
import { ArticuloMysql } from './articuloMysql';
import { Categoria } from '../categoria/categoria';
import { Caracteristica }  from '../caracteristicas/caracteristica';
import { CaracteristicaItem } from './caracteristica';
import { Constantes } from '../constantes';
import { Equipo } from './equipo';
import { Marca } from './marca';
import { Miga } from '../miga';
import { Precios} from '../planes/precios';
import { ArticuloService} from './articulo.service';
import { CaracteristicaService } from '../caracteristicas/caracteristica.service';
import { CategoriaService } from '../categoria/categoria.service';
import { MarcaService} from '../marcadistri/marca.service';
import { PlanesService} from '../planes/planes.service';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';

export interface articuloData {
  id: string;
  nombre: string;
  categoria: string;
  cantidad: Number;
  estado: string;
}

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css'],
  providers: [ArticuloService]
})

export class ArticuloComponent implements OnInit {

  flag                    : boolean               = true;
  itemsDatosGenerales     : [number, string][]    = new Array();
  contador_datos_generales                        = 1;
  itemsCaracteristicas    : Number[]              = new Array();
  contador_caracteristicas                        = 1;
  itemsImagenes           : string[]              = new Array();
  contador_imagenes                               = 1;
  itemseleccionado        : string                = "";
  readonly URL_API                                = Constantes.URL_API_IMAGEN + '/subir';
  readonly URL_IMAGES                             = Constantes.URL_IMAGENES;
  selectedFile            : File                  = null;
  vista                   : string                = "1";
  //CATEGORIAS
  listacategorias         : Categoria[];
  listamarcas             : Marca[];
  //CARACTERISRTICAS
  listacaracteristicas    : Caracteristica[];
  listacaracteristicasarticulo : CaracteristicaItem[];
  //lista imagenes
  listaimagenes           : string[];
  //contenido del editor
  contenidoEditor         : string = "<p></p>";
  // lista de imagenes seleccionadas
  imagenesSeleccionadas   : string[] = new Array();
   // nombre imagen para el editor
  imageneditorseleccionada: string="";
  migas                   : Miga[] = [new Miga('Artículos','articulos')];
  editorInstance          : any;
  // Property Binding
  mostrarFormularioArticulo   : boolean = false;
  mostrarBotonOpcion          : boolean = false;
  mostrarListaArticulos       : boolean = false;
  mostrarCarga                : boolean = false;
  //Lista de precios
  listaprecios                : Precios[] = new Array();
  listaequipos                = new Array();
  listaplanesequipo           = new Array();
  mostrarImagen           : boolean = false;
  mostrarListaImgenesEquipo : boolean = false;
  planesseleccionada = {
    tipoplan:"",
    planes: new Array()
  };

  quillConfig={
    toolbar: {
      container: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],        
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction        
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],        
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],        
            ['clean'],                                         // remove formatting button        
            ['link', 'image', 'video']                         // link and image, video
         ],
         handlers: {'image': this.buscaNuevaImagenEditor}
       }
  };

  // DATA TABLE ANGULAR MATERIAL  
  displayedColumns: string[] = ['idArticulo', 'Descripcion', 'Cantidad', 'Categoria', 'Estado','editar'];
  dataSource: MatTableDataSource<ArticuloMysql>;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  displayedColumnsEquipos: string[] = ['Imagen','idArticulo', 'Descripcion', 'Cantidad', 'Color', 'Detalle','Editar'];
  dataSourceEquipos: MatTableDataSource<Equipo>;
  indiceEquipo = 0;
  nombreColor = "";
  codigoColor = "";
  detallesEquipo = "";
  imagenEquipo="";
  descripcionEquipoSeleccionado="";
  palabraImagenesbuscar="";
  listaimagenesfiltro           : string[];
  agregarEn = "equipo"; // o editor
  planSeleccionado = {
    precio:0
  };

  constructor(public http: HttpClient, 
              public articuloService: ArticuloService,
              public categoriaService: CategoriaService,
              public caracteristicaService: CaracteristicaService,
              public marcaService: MarcaService,
              public planesService: PlanesService, 
              public snackBar: MatSnackBar) { 
                this.dataSource = new MatTableDataSource(this.articuloService.articulosMysql);
              }

  ngOnInit() {
    this.itemsDatosGenerales.push([1, ""]);
    this.itemsCaracteristicas.push(1);
    this.itemsImagenes.push("imagen-1");
    this.listacaracteristicas = new Array();
    this.getArticulosMysql();
    this.getCategorias();
    this.getMarcas();
    this.obtenerListaPrecios();
    this.articuloService.articuloSeleccionado.equipos.push(new Equipo("", "", 0, "", "", ""));
    this.getListaImagenes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort.toArray()[0];
  }

  created(editorInstance: any) {
    this.editorInstance = editorInstance;
  }

  limpiarFormulario() {
    this.articuloService.articuloSeleccionado = new Articulo();
    this.imagenesSeleccionadas = new Array();
    this.listacaracteristicas = new Array();
    this.itemsDatosGenerales = new Array();
    this.contenidoEditor = "<p></p>";
    this.listacaracteristicasarticulo = new Array();
  }

  obtenerListaPrecios() {
    this.planesService.getEquipos().subscribe(res => {
      this.listaequipos = res as any[];
    });
  }

  obtenerEquiposArticulo() {
    this.articuloService.articuloSeleccionado.equipos = new Array();
    this.articuloService.articuloSeleccionado.equipos.push(new Equipo("", "", 0, "", "", ""));
    this.articuloService.getEquiposArticulo().subscribe(res => {
      this.articuloService.articuloSeleccionado.equipos = res as Equipo[];
      this.dataSourceEquipos = new MatTableDataSource(res as Equipo[]);
      this.dataSourceEquipos.paginator = this.paginator.toArray()[1];
      this.dataSourceEquipos.sort = this.sort.toArray()[1];
    });
  }

  buscarPreciosEquipo() {
    var cont = 0;
    var cont_ante = 0;
    var mejor_nombre = "";
    var arraynombres = this.articuloService.articuloSeleccionadoMysql.Descripcion.split(" ");
    for (var i = 0; i < this.listaequipos.length; i++) {
      var nombre = this.listaequipos[i].nombreequipo;
      for (var j = 0; j < arraynombres.length; j++) {
        if (nombre.includes(arraynombres[j])) {
          cont++;
        }
      }
      if (cont > cont_ante) {
        mejor_nombre = nombre;
        cont_ante = cont;
        cont = 0;
      } else {
        cont = 0;
      }
    }
    this.articuloService.articuloSeleccionado.idprecio = mejor_nombre;
  }

  buscarPlanesEquipo() {
    this.planesService.getPlanesEquipo(this.articuloService.articuloSeleccionado.idprecio).subscribe(res => {
      this.planSeleccionado = res[0];
    });
  }

  mostrarDetalleTipoPlan(tipoplan) {
    this.planesseleccionada = tipoplan;
  }

  cambiarvista(articulo ? : ArticuloMysql, form ? : NgForm) {
    if (this.vista == "1") {
      this.vista = "2";
      this.mostrarListaArticulos = false;
      this.mostrarFormularioArticulo = true;
      this.mostrarBotonOpcion = true;
      this.limpiarFormulario();
      this.articuloService.articuloSeleccionado.idarticulo = articulo.idArticulo;
      this.articuloService.articuloSeleccionado.cantidad = articulo.Cantidad;
      this.articuloService.articuloSeleccionadoMysql = articulo;
      this.articuloService.articuloSeleccionado.titulo = articulo.Descripcion;
      this.articuloService.articuloSeleccionado.descuento = 0;
      this.buscarPreciosEquipo();
      this.obtenerEquiposArticulo();
      this.generarURL();
    } else {
      this.vista = "1";
      this.mostrarListaArticulos = true;
      this.mostrarFormularioArticulo = false;
      this.mostrarBotonOpcion = false;
      this.dataSource = new MatTableDataSource(this.articuloService.articulosMysql);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort.toArray()[0];
    }
  }

  getArticulosMysql() {
    this.mostrarCarga = true;
    this.mostrarListaArticulos = false;
    this.articuloService.getArticulosMysql().subscribe(res => {
      this.articuloService.articulosMysql = res as ArticuloMysql[];
      if (this.articuloService.articulosMysql.length > 0) {
        this.mostrarListaArticulos = true;
      }
      this.dataSource = new MatTableDataSource(this.articuloService.articulosMysql);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort.toArray()[0];
      this.mostrarCarga = false;
    });
  }

  getCategorias() {
    this.categoriaService.getCategorias().subscribe(res => {
      this.listacategorias = res as Categoria[];
    });
  }

  getMarcas() {
    this.marcaService.getMarcas().subscribe(res => {
      this.listamarcas = res as Marca[];
    });
  }

  getCaracteristicas() {
    this.listacaracteristicasarticulo = new Array();
    for (var i = 0; i < this.listacategorias.length; i++) {
      if (this.articuloService.articuloSeleccionado.categoria == this.listacategorias[i]._id) {
        this.listacaracteristicas = this.listacategorias[i].caracteristicas;
      }
    }
    for (var i = 0; i < this.listacaracteristicas.length; i++) {
      this.listacaracteristicasarticulo.push(new CaracteristicaItem(this.listacaracteristicas[i].nombre, ""));
    }
  }

  editarArticulo(art) {
    this.itemsDatosGenerales = new Array();
    this.articuloService.articuloSeleccionadoMysql = art;
    this.articuloService.getArticulo(this.articuloService.articuloSeleccionadoMysql.idArticulo).subscribe(res => {
      this.articuloService.articuloSeleccionado = res[0] as Articulo;
      this.imagenesSeleccionadas = this.articuloService.articuloSeleccionado.imagenes;
      try {
        for (var i = 0; i < this.imagenesSeleccionadas.length; i++) {
          var inputcheck = document.getElementById(this.imagenesSeleccionadas[i]) as HTMLInputElement;
          inputcheck.checked = true;
        }
      } catch (e) {
        this.openSnackBar(false, e);
      }
      this.contenidoEditor = this.articuloService.articuloSeleccionado.descripcion;
      this.listacaracteristicasarticulo = this.articuloService.articuloSeleccionado.caracteristicas;
      this.obtenerEquiposArticulo();
      if (this.listacaracteristicasarticulo.length == 0) {
        this.getCaracteristicas();
      }
      this.buscarPlanesEquipo();
      this.vista = "2";
      this.mostrarListaArticulos = false;
      this.mostrarFormularioArticulo = true;
      this.mostrarBotonOpcion = true;
      this.mostrarBotonOpcion = true;
    });
  }

  agregarCaractgarCaracteristica() {
    this.contador_caracteristicas = this.contador_caracteristicas + 1;
    this.itemsCaracteristicas.push(this.contador_caracteristicas);
  }

  eliminarItemCaracteristica(id: Number) {
    for (var i = 0; i < this.itemsCaracteristicas.length; i++) {
      if (this.itemsCaracteristicas[i] == id) {
        this.itemsCaracteristicas.splice(i, 1);
      }
    }
  }

  eliminarItemImagen(id: string) {
    this.listaimagenesfiltro = this.listaimagenes;
    for (var i = 0; i < this.imagenesSeleccionadas.length; i++) {
      if (this.imagenesSeleccionadas[i] == id) {
        this.imagenesSeleccionadas.splice(i, 1);
        var inputcheck = document.getElementById(id) as HTMLInputElement;
        inputcheck.checked = false;
      } else {
        var inputcheck = document.getElementById(id) as HTMLInputElement;
        inputcheck.checked = true;
      }
    }
  }

  buscaNuevaImagen() {
    document.getElementById("imageninput").click();
  }

  buscaNuevaImagenEditor() {
    this.agregarEn = "editor";
    document.getElementById("btnimageneditor").click();
  }

  abrirImagenes() {
    this.agregarEn = "equipo";
    this.mostrarListaImgenesEquipo = true;
  }

  abrirFormularioEquipo() {
    this.mostrarListaImgenesEquipo = false;
  }

  elegirImagenEquipo(img) {
    this.imagenEquipo = img;
  }

  agregarImagenEquipo() {
    var imagen = document.getElementById("imagen-select") as HTMLImageElement;
    imagen.src = this.URL_IMAGES + "/md/" + this.imagenEquipo;
    this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].imagen = this.imagenEquipo;
    this.mostrarImagen = true;
    this.abrirFormularioEquipo();
  }

  getListaImagenes() {
    this.articuloService.getImagenes().subscribe(res => {
      this.listaimagenes = res as string[];
      this.listaimagenesfiltro = this.listaimagenes;
    });
  }

  buscarImagen() {
    this.getListaImagenes();
  }

  generarURL() {
    var titulo = this.articuloService.articuloSeleccionado.titulo;
    for (var i = 0; i < titulo.length; i++) {
      titulo = titulo.replace(" ", "-");
    }
    this.articuloService.articuloSeleccionado.url = titulo.toLowerCase();
  }

  elegirImagen(nombre: string) {
    this.imageneditorseleccionada = nombre;
  }

  agregarImagenEditor() {
    const range = this.editorInstance.getSelection();
    this.editorInstance.insertEmbed(range.index, 'image', this.URL_IMAGES + "/lg/" + this.imageneditorseleccionada);
  }

  agregarImagenesArticulo(nombre: string) {
    var existe = false;
    for (var i = 0; i < this.imagenesSeleccionadas.length; i++) {
      if (this.imagenesSeleccionadas[i] == nombre) {
        this.imagenesSeleccionadas.splice(i, 1);
        existe = true;
      }
    }
    if (!existe) {
      this.imagenesSeleccionadas.push(nombre);
    }
  }

  editarEquipo(i) {
    this.indiceEquipo = i;
    this.imagenEquipo = this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].imagen;
    this.descripcionEquipoSeleccionado = this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].descripcion;
    this.nombreColor = this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].color;
    this.codigoColor = this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].codigocolor;
    this.detallesEquipo = this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].detalle;
    var imagen = document.getElementById("imagen-select") as HTMLImageElement;
    imagen.src = this.URL_IMAGES + "/md/" + this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].imagen;
    this.mostrarImagen = true;
  }

  buscarImagenesFiltro(event) {
    var input = document.getElementById("input-busqueda-imagenes-articulo") as HTMLInputElement;
    this.listaimagenesfiltro = new Array();
    for (var i = 0; i < this.listaimagenes.length; i++) {
      var inputcheck = document.getElementById(this.listaimagenes[i] + "itemimg") as HTMLDivElement;
      if (this.listaimagenes[i].includes(input.value)) {
        inputcheck.hidden = false;
      } else {
        inputcheck.hidden = true;
      }
    }
  }

  buscarImagenesFiltroEditor() {
    var input = document.getElementById("input-busqueda-imagenes-articulo-editor") as HTMLInputElement;
    this.listaimagenesfiltro = new Array();
    for (var i = 0; i < this.listaimagenes.length; i++) {
      var inputcheck = document.getElementById(this.listaimagenes[i] + "editor") as HTMLDivElement;
      if (this.listaimagenes[i].includes(input.value)) {
        inputcheck.hidden = false;
      } else {
        inputcheck.hidden = true;
      }
    }
  }

  buscarImagenesFiltroEquipo() {
    var input = document.getElementById("input-busqueda-imagenes-equipo") as HTMLInputElement;
    this.listaimagenesfiltro = new Array();
    for (var i = 0; i < this.listaimagenes.length; i++) {
      var inputcheck = document.getElementById(this.listaimagenes[i] + "equipo") as HTMLDivElement;
      if (this.listaimagenes[i].includes(input.value)) {
        inputcheck.hidden = false;
      } else {
        inputcheck.hidden = true;
      }
    }
  }

  subirImagen(evento) {
    this.selectedFile = < File > evento.target.files[0];
    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('nombre', 'nuevonombre.webp');
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    this.http.post(this.URL_API, fd, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.openSnackBar(true, "Subiendo " + Math.round(event.loaded / event.total * 100) + " %");
        if (Math.round(event.loaded / event.total * 100) == 100) {
          this.openSnackBar(true, "La imagén se subió al servidor con éxito");
        }
      } else {
        if (event.type === HttpEventType.Response) {
          this.getListaImagenes();
        }
      }
    });
  }

  subirImagenEditor(evento) {
    this.selectedFile = < File > evento.target.files[0];
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    this.http.post(this.URL_API, fd, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.openSnackBar(true, "Subiendo " + Math.round(event.loaded / event.total * 100) + " %");
        if (Math.round(event.loaded / event.total * 100) == 100) {
          this.openSnackBar(true, "La imagén se subió al servidor con éxito");
        }
      } else {
        if (event.type === HttpEventType.Response) {
          this.getListaImagenes();
        }
      }
    });
  }

  guardarDatos() {
    //Obtener datos generales del articulo
    this.articuloService.articuloSeleccionado.especificaciones = new Array();
    var datosgenerales = document.getElementById("contenido-datos-generales");
    var datos = datosgenerales.getElementsByTagName("input");
    for (var i = 0; i < datos.length; i++) {
      var dato = datos[i] as HTMLInputElement;
      if (dato.value != "") {
        this.articuloService.articuloSeleccionado.especificaciones.push(dato.value);
      }
    }
    //Obtener datos caracteristicas   
    this.articuloService.articuloSeleccionado.caracteristicas = new Array();
    var datoscaracteristicas = document.getElementById("contenido-datos-caracteristicas");
    var caracteristicas = datoscaracteristicas.getElementsByClassName("item-caracteristicas");
    for (var i = 0; i < caracteristicas.length; i++) {
      var c = new CaracteristicaItem(caracteristicas[i].getElementsByTagName("input")[0].value, caracteristicas[i].getElementsByTagName("input")[1].value);
      this.articuloService.articuloSeleccionado.caracteristicas.push(c);
    }
    //Asignar imagenes
    this.articuloService.articuloSeleccionado.imagenes = this.imagenesSeleccionadas;
    this.articuloService.articuloSeleccionado.descripcion = this.contenidoEditor;
    //guardar datos
    if (this.articuloService.articuloSeleccionado._id) {
      this.articuloService.putArticulo(this.articuloService.articuloSeleccionado).subscribe(res => {
        var respuesta = JSON.parse(JSON.stringify(res));
        if (respuesta.estado == "0") {
          this.openSnackBar(false, respuesta.mensaje);
        } else {
          this.cambiarvista();
          this.getArticulosMysql();
          this.openSnackBar(true, respuesta.mensaje);
        }
      });
    } else {
      this.articuloService.postArticulo(this.articuloService.articuloSeleccionado).subscribe(res => {
        var respuesta = JSON.parse(JSON.stringify(res));
        if (respuesta.estado == "0") {
          this.openSnackBar(false, respuesta.mensaje);
        } else {
          this.cambiarvista();
          this.getArticulosMysql();
          this.openSnackBar(true, respuesta.mensaje);
        }
      });
    }
  }

  /// aplicar filtro en el data table de material
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterEquipo(filterValue: string) {
    this.dataSourceEquipos.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceEquipos.paginator) {
      this.dataSourceEquipos.paginator.firstPage();
    }
  }

  abrirInputFile() {
    var archivoinput = document.getElementById("archivo") as HTMLInputElement;
    archivoinput.click();
  }

  limpiarImagen() {
    this.mostrarImagen = false;
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    this.http.post(Constantes.URL_API_IMAGEN + '/subir', fd, {
        reportProgress: true,
        observe: 'events'
      })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.openSnackBar(true, "Subiendo " + Math.round(event.loaded / event.total * 100) + " %");
          if (Math.round(event.loaded / event.total * 100) == 100) {
            this.openSnackBar(true, "Se subió la imagen con éxito");
          }
        } else {
          if (event.type === HttpEventType.Response) {
            var res = JSON.parse(JSON.stringify(event.body));
            var imagen = document.getElementById("imagen-select") as HTMLImageElement;
            imagen.src = this.URL_IMAGES + "/md/" + res.imagen;
            this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].imagen = res.imagen;
            this.mostrarImagen = true;
            this.imagenEquipo = this.selectedFile.name + ".webp";
          }
        }
      });
  }

  guardarDatosEquipo() {
    this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].color = this.nombreColor;
    this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].detalle = this.detallesEquipo;
    this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].codigocolor = this.codigoColor;
    this.imagenEquipo = ""
  }

  buscarPalabrasClaves() {
    var palabras = this.articuloService.articuloSeleccionado.titulo;
    for (var i = 0; i < this.listacategorias.length; i++) {
      if (this.articuloService.articuloSeleccionado.categoria == this.listacategorias[i]._id) {
        palabras += " " + this.listacategorias[i].nombre;
        break;
      }
    }
    for (var i = 0; i < this.listamarcas.length; i++) {
      if (this.articuloService.articuloSeleccionado.marca == this.listamarcas[i]._id) {
        palabras += " " + this.listamarcas[i].nombremarca;
        break;
      }
    }
    var datoscaracteristicas = document.getElementById("contenido-datos-caracteristicas");
    var caracteristicas = datoscaracteristicas.getElementsByClassName("item-caracteristicas");
    for (var i = 0; i < caracteristicas.length; i++) {
      var c = new CaracteristicaItem(caracteristicas[i].getElementsByTagName("input")[0].value, caracteristicas[i].getElementsByTagName("input")[1].value);
      palabras += " " + c.nombre + " " + c.valor;
    }
    for (var i = 0; i < this.articuloService.articuloSeleccionado.equipos.length; i++) {
      if (this.articuloService.articuloSeleccionado.equipos[i].cantidad > 0)
        palabras += " " + this.articuloService.articuloSeleccionado.equipos[i].color + " " + this.articuloService.articuloSeleccionado.equipos[i].detalle;
    }
    this.articuloService.articuloSeleccionado.palabrasclaves = palabras.toLowerCase();
  }

  /**
   * Método que muestra un Bar temporal para confirmar los mensajes de éxito y de error
   * @param status : Determina si es un mensaje de confirmación o error
   * @param mensaje : mensaje a enviar
   */
  openSnackBar(status: boolean, mensaje: string): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 3000,
      panelClass: [status ? 'exito' : 'error'],
      data: mensaje
    });
  }

}
