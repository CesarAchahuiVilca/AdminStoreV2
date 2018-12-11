import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
    imports: [MatButtonModule,MatSnackBarModule, MatCheckboxModule, MatTabsModule, MatIconModule, MatMenuModule, MatTableModule, MatInputModule, MatCardModule, MatDatepickerModule, MatRadioModule, MatSelectModule],
    exports: [MatButtonModule,MatSnackBarModule, MatCheckboxModule, MatTabsModule, MatIconModule, MatMenuModule, MatTableModule, MatInputModule, MatCardModule, MatDatepickerModule, MatRadioModule, MatSelectModule],
  })
  export class MaterialModule { }