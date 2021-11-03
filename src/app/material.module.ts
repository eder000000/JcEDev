import { NgModule } from "@angular/core";
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'




@NgModule ({
  imports: [MatCardModule,
            MatFormFieldModule,
            MatIconModule, 
            MatSidenavModule,
            MatToolbarModule,
            MatListModule,
            MatMenuModule,
            ReactiveFormsModule,
            FormsModule,
            MatInputModule
          ],

  exports: [MatCardModule,
            MatFormFieldModule,
            MatIconModule, 
            MatSidenavModule,
            MatToolbarModule,
            MatListModule,
            MatMenuModule,
            ReactiveFormsModule,
            FormsModule,
            MatInputModule]
})

export class MaterialModule {}