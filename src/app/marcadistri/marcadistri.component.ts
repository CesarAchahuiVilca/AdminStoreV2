import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';

export interface PeriodicElement {
  marca: string;
  position: number;
  codigo: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, codigo:'12', marca: 'Hydrogen'},
  {position: 2, codigo:'12', marca: 'Helium'},
  {position: 3, codigo:'12', marca: 'Lithium'},
  {position: 4, codigo:'12', marca: 'Beryllium'},
  {position: 5, codigo:'12', marca: 'Boron'},
  {position: 6, codigo:'12', marca: 'Carbon'},
  {position: 7, codigo:'12', marca: 'Nitrogen'},
  {position: 8, codigo:'12', marca: 'Oxygen'},
  {position: 9, codigo:'12', marca: 'Fluorine'},
  {position: 10, codigo:'12', marca: 'Neon'},
];

@Component({
  selector: 'app-marcadistri',
  templateUrl: './marcadistri.component.html',
  styleUrls: ['./marcadistri.component.css']
})

export class MarcadistriComponent implements OnInit {
  displayedColumns: string[] = ['position', 'codigo', 'marca'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  value2 = '';

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor() { }

  ngOnInit() {
  }
  
  funprueba(dato){
    console.log(ELEMENT_DATA[dato-1]);
  }

}
