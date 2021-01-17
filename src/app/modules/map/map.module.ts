import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouteReuseStrategy} from '@angular/router';
import {CustomRouteReuseStrategy} from '../core/custom-route-reuse-strategy';
import {MapComponent} from './components/map.component';
import {MapDirective} from './directives/map.directive';


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
