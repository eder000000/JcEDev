import { NgModule } from "@angular/core";
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';


@NgModule ({
  imports: [MatCardModule,
            MatFormFieldModule,
            MatIconModule, 
            MatSidenavModule],
            
  exports: [MatCardModule,
            MatFormFieldModule,
            MatIconModule, 
            MatSidenavModule]
})

export class MaterialModule {}