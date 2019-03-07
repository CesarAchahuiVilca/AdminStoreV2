import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {
  datcorreo: string = '';
  datnroped: string = '';

  constructor() { }

  ngOnInit() {
  }

  consultar() {
    if (this.datcorreo != '') {
      console.log(this.datcorreo);
      document.getElementById('datosSeg').hidden = false;
    }
    else {
      if (this.datnroped != '') {
        console.log(this.datnroped);
        document.getElementById('datosSeg').hidden = false;
      }
      else {
        alert('NO SE INGRESO NINGUN DATO !!!!')
      }
    }
  }

}
