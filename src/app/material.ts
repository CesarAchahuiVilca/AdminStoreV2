import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { NgModule } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { MatIconModule, MatMenuModule } from '@angular/material';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
    imports: [MatButtonModule,MatSnackBarModule, MatCheckboxModule, MatTabsModule, MatIconModule, MatMenuModule, MatTableModule, MatInputModule],
    exports: [MatButtonModule,MatSnackBarModule, MatCheckboxModule, MatTabsModule, MatIconModule, MatMenuModule, MatTableModule, MatInputModule],
  })
  export class MaterialModule { }