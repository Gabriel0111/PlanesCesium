import {Directive, ElementRef, OnInit} from '@angular/core';
import * as Cesium from 'cesium';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/appState';
import {PlanesService} from '../planes/planes.service';
import {DEFAULT_ACCESS_TOKEN} from '../core/constants';

@Directive({
  selector: '[appMap]'
})
export class MapDirective implements OnInit {

  constructor(private el: ElementRef, private store: Store<AppState>, private planesService: PlanesService) {
  }

  async ngOnInit(): Promise<void> {
    Cesium.Ion.defaultAccessToken = DEFAULT_ACCESS_TOKEN;
    await this.planesService.initMap(this.el.nativeElement);
  }

}
