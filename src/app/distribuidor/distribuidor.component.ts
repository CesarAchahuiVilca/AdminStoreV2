import { Distribuidormysql } from './distribuidormysql';
import { Component, OnInit } from '@angular/core';
import { DistribuidorService } from './distribuidor.service';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { Subject } from 'rxjs';
import {HttpClient, HttpEventType} from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-distribuidor',
  templateUrl: './distribuidor.component.html',
  styleUrls: ['./distribuidor.component.css'],
  providers:[Distribuidor]
})
export class DistribuidorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
