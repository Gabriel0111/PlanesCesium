import * as Cesium from 'cesium';
import {Directive, ElementRef, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {DEFAULT_ACCESS_TOKEN} from '../../core/constants';
import {PlanesService} from '../../planes/services/planes.service';
import {AppState} from '../../../store/appState';

@Directive({
  selector: '[appMap]'
})
export class MapDirective implements OnInit {

  constructor(private el: ElementRef, private store: Store<AppState>, private planesService: PlanesService) {
  }

  ngOnInit(): void {
    Cesium.Ion.defaultAccessToken = DEFAULT_ACCESS_TOKEN;
    this.planesService.initMap(this.el.nativeElement);
  }

}
