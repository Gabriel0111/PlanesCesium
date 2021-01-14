import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapComponent} from './map.component';
import {MapDirective} from './map.directive';
import {RouteReuseStrategy} from '@angular/router';
import {CustomRouteReuseStrategy} from '../core/custom-route-reuse-strategy';


@NgModule({
  declarations: [MapComponent, MapDirective],
  imports: [
    CommonModule
  ],
  exports: [MapComponent],
  // providers: [
  //   {
  //     provide: RouteReuseStrategy,
  //     useClass: CustomRouteReuseStrategy
  //   }
  // ]
})
export class MapModule {
}
