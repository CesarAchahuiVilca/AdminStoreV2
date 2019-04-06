import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar} from '@angular/material';
import { Miga } from '../miga'
import { Respuesta } from '../usuario/respuesta';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.css']
})
export class CargoComponent implements OnInit {
  public migas = [ new Miga('Cargos','/cargos')];
  displayedColumns: string[] = ['id', 'amount', 'installments', 'net_amount'];
  dataSource : MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  /**
   * Método para filtrar la tabla de datos
   * @param filtro 
   */
  aplicarFiltro(filtro: string){
    this.dataSource.filter = filtro.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Método que muestra un bar temporal con un mensaje
   * @param status : indica si es un error o confirmación
   * @param mensaje : texto del mensaje
   */
  openSnackBar(status: boolean, mensaje: string): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 3000,
      panelClass: [status ? 'exito' : 'error'],
      data: mensaje
    });
  }
}
