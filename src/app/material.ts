import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { NgModule } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { MatIconModule, MatMenuModule } from '@angular/material';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';

@NgModule({
    imports: [MatButtonModule, MatCheckboxModule, MatTabsModule, MatIconModule, MatMenuModule, MatTableModule, MatInputModule],
    exports: [MatButtonModule, MatCheckboxModule, MatTabsModule, MatIconModule, MatMenuModule, MatTableModule, MatInputModule],
  })
  export class MaterialModule { }