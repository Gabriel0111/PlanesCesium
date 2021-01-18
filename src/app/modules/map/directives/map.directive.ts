import {Directive, ElementRef, OnInit} from '@angular/core';
import {DEFAULT_ACCESS_TOKEN} from '../../core/constants';
import {MapService} from '../services/map.service';
import {Ion} from 'cesium';

@Directive({
  selector: '[appMap]'
})
export class MapDirective implements OnInit {
  constructor(private htmlElement: ElementRef, private mapService: MapService) {
  }

  ngOnInit(): void {
    Ion.defaultAccessToken = DEFAULT_ACCESS_TOKEN;
    this.mapService.initMap(this.htmlElement.nativeElement);
  }
}
