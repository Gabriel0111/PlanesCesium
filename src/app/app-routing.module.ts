import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapComponent} from './modules/map/map.component';
import {PlanesComponent} from './modules/planes/planes.component';


const routes: Routes = [
  {path: '', component: MapComponent, data: {noReuse: true}},
  {path: 'planes', component: PlanesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
