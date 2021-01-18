import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlanesComponent} from './modules/planes/components/planes.component';
import {MapComponent} from './modules/map/components/map.component';

const routes: Routes = [
  {path: '', component: MapComponent},
  {path: 'planes', component: PlanesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
