import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './tienda/custom-mat-paginator-intl';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    imports: [MatButtonModule,MatSnackBarModule, MatCheckboxModule, MatTabsModule, MatIconModule, MatMenuModule, MatTableModule, MatInputModule, MatCardModule, MatDatepickerModule, MatRadioModule, MatSelectModule, MatListModule, MatPaginatorModule, MatSortModule, MatExpansionModule, MatDialogModule],
    exports: [MatButtonModule,MatSnackBarModule, MatCheckboxModule, MatTabsModule, MatIconModule, MatMenuModule, MatTableModule, MatInputModule, MatCardModule, MatDatepickerModule, MatRadioModule, MatSelectModule, MatListModule, MatPaginatorModule, MatSortModule, MatExpansionModule, MatDialogModule],
    providers: [{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl}]
  })
  export class MaterialModule { }