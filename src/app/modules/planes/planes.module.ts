import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanesComponent } from './planes.component';
import {PlanesService} from './planes.service';

@NgModule({
  declarations: [PlanesComponent],
  imports: [
    CommonModule
  ],
  exports: [PlanesComponent],
  providers: [PlanesService]
})
export class PlanesModule { }
