import {Directive, ElementRef, OnInit} from '@angular/core';
import * as Cesium from 'cesium';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/appState';
import {PlanesService} from '../planes/planes.service';

@Directive({
  selector: '[appMap]'
})
export class MapDirective implements OnInit {

  constructor(private el: ElementRef, private store: Store<AppState>, private planesService: PlanesService) {
  }

  ngOnInit(): void {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMmE4ZTdmNy0xYzBmLTQ0MjktOWUwNi0wMjM5MjNjMjA3ZjIiLCJpZCI6NDEzNTMsImlhdCI6MTYxMDAxMTIwNn0.Js_v2QdfuErTdcEGyH9zIwzduhwLX6YL3Fd5App2sBg';

    this.planesService.initMap(this.el.nativeElement);
  }

}
