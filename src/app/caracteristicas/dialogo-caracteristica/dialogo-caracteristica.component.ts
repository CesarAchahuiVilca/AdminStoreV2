import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialogo-caracteristica',
  templateUrl: './dialogo-caracteristica.component.html',
  styles: []
})
export class DialogoCaracteristicaComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DialogoCaracteristicaComponent> ){ }

  ngOnInit() {
  }

  declinar(){
    this.dialogRef.close();
  }
}
