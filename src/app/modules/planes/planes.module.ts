import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PlanesComponent} from './components/planes.component';
import {PlanesService} from './services/planes.service';

@NgModule({
  declarations: [PlanesComponent],
  imports: [CommonModule],
  exports: [PlanesComponent],
  providers: [PlanesService]
})
export class PlanesModule { }
