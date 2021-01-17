import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {StoreModule} from '@ngrx/store';
import {planesReducers} from './store/planes.reducers';
import {HttpClientModule} from '@angular/common/http';
import {PlanesModule} from './modules/planes/planes.module';
import {MapModule} from './modules/map/map.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    MapModule,
    PlanesModule,
    StoreModule.forRoot({planes: planesReducers}, {
      runtimeChecks: {
        strictStateImmutability: false, // TODO: Modify
        strictActionImmutability: false
      }}),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
