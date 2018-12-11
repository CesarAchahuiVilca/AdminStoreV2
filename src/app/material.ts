import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    imports: [MatButtonModule,MatSnackBarModule, MatCheckboxModule, MatTabsModule, MatIconModule, MatMenuModule, MatTableModule, MatInputModule, MatCardModule, MatDatepickerModule, MatRadioModule, MatSelectModule, MatListModule],
    exports: [MatButtonModule,MatSnackBarModule, MatCheckboxModule, MatTabsModule, MatIconModule, MatMenuModule, MatTableModule, MatInputModule, MatCardModule, MatDatepickerModule, MatRadioModule, MatSelectModule, MatListModule],
  })
  export class MaterialModule { }