import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapComponent} from './components/map.component';
import {MapDirective} from './directives/map.directive';

@NgModule({
  declarations: [MapComponent, MapDirective],
  imports: [CommonModule],
  exports: [MapComponent]
})
export class MapModule {
}
