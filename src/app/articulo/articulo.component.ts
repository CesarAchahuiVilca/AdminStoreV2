import { Component, OnInit } from '@angular/core';
import{ ArticuloService} from './articulo.service';
import {HttpClient, HttpEventType} from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Articulo } from './articulo';
import { ArticuloMysql } from './articuloMysql';


@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css'],
  providers: [ArticuloService]
})
export class ArticuloComponent implements OnInit {

  constructor(private http: HttpClient, private articuloService: ArticuloService) { }

  ngOnInit() {
    this.getArticulosMysql();
  }

  getArticulosMysql(){
    this.articuloService.getArticulosMysql()
    .subscribe(res=>{
      this.articuloService.articulosMysql = res as ArticuloMysql[];
      if(this.articuloService.articulosMysql.length == 0){
        console.log("No se encontraron datos");
      }else{
        console.log("Exito..");
      }
    });
  }


}
