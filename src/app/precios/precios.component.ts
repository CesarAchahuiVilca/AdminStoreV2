import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Miga } from '../miga';
import { Constantes } from '../constantes';
import { PreciosService }from './precios.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.css']
})
export class PreciosComponent implements OnInit {
  readonly URL_API = Constantes.URL_API_PLANES+"/subir";

  mensajeestado = "";
  selectedFile: File = null;
  migas = [new Miga('Precios','/precios')];
  progreso=0;
  modo = 'determinate';
  mostrarProceso = false;
  mostrarOpciones = false;
  nombreArchivoSeleccionado = "";
  disabledbtnFile= false;
  mostrarListaPrecios = false;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  listaprecios: any[] = new Array();
  constructor(private http: HttpClient,public preciosService: PreciosService) { }

  ngOnInit() {
    /*var progreso = document.getElementById("progreso") as HTMLDivElement;
    progreso.style.width = 0+"%";*/
  }
  ngAfterViewInit(): void {
    
  }


  guardarListaPrecios(){
    this.preciosService.guardarPreciosVenta({precios:this.listaprecios,fechavigencia:'01/07/2019'})
    .subscribe(res=>{
      console.log(res);
    });
  }
  descargarExcel(){
    console.log("decargnado excel");
    this.preciosService.descargarBaseExcel().subscribe(res=>{
      var data: any = res;
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      var url = window.URL.createObjectURL(blob);
      var anchor = document.createElement("a");
      anchor.download = "Lista de precios.xlsx";
      anchor.href = url;
      anchor.click();
    });    
  }

  abrirDialogo(){
    document.getElementById("input_excel").click();

  }
  eligioArchivo(evento){
    var input = document.getElementById("input_excel") as HTMLInputElement;
    if(input.value != ""){
      this.nombreArchivoSeleccionado = input.value.replace(/C:\\fakepath\\/i, '');
      this.selectedFile = evento.target.files[0];    
      this.mostrarOpciones = true;   
      this.mostrarProceso = false;
      this.progreso = 0; 
      this.disabledbtnFile= true;

    }else{
      this.mostrarOpciones = false;   
      this.mostrarProceso = false;
    }
  }
  cancelarProceso(){
    this.mostrarOpciones = false;   
    this.mostrarProceso = false;
    this.progreso = 0; 
    this.disabledbtnFile= false;
    this.mostrarListaPrecios = false;
    var inputfile = document.getElementById("input_excel") as HTMLInputElement;
    inputfile.value = "";
  }
  procesarExcel(){
    //evento.preventDefault();
    this.mostrarOpciones = false;
    this.mostrarProceso = true;
    const fd = new FormData();
    this.mensajeestado = "Subiendo...";
    fd.append('excel',this.selectedFile, this.selectedFile.name);
    this.http.post(this.URL_API,fd,{
      reportProgress: true,
      observe: 'events'
    })
    .subscribe(event=>{
        if(event.type === HttpEventType.UploadProgress){
          console.log("Subiendo "+ Math.round(event.loaded/event.total*100)+" %");
          //progreso.style.width = Math.round(event.loaded/event.total*100)+"%";
          this.progreso = event.loaded/event.total*100;         
          
          if(Math.round(event.loaded/event.total*100) == 100){
            this.mensajeestado = "Completado";
          }
        
        }else{
          if(event.type === HttpEventType.Response){
            this.listaprecios = event.body as any[];
            this.displayedColumns = this.listaprecios[0];
            this.listaprecios.splice(0, 1);  
            this.dataSource = new MatTableDataSource(this.listaprecios);
            this.dataSource.paginator = this.paginator.toArray()[0];
            this.dataSource.sort = this.sort.toArray()[0];
            this.mostrarListaPrecios= true;
            //console.log(listaprecios);           
          }
        }
      }
    );

  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  mostrarListaPlanes(res){
    console.log(res);

  }
}
