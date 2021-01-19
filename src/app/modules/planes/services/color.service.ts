import {Injectable} from '@angular/core';
import {Plane, PlaneFamily} from '../../core/plane.model';
import {Color} from 'cesium';
import {AIR_FORCE_COLOR, CIVILIAN_COLOR, LAND_FORCE_COLOR} from '../../core/constants';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  colorPlane(plane: Plane): Color {
    switch (plane.family) {
      case PlaneFamily.LAND_FORCE:
        return Color.fromCssColorString(LAND_FORCE_COLOR);
      case PlaneFamily.AIR_FORCE:
        return Color.fromCssColorString(AIR_FORCE_COLOR);
      case PlaneFamily.CIVILIAN:
        return Color.fromCssColorString(CIVILIAN_COLOR);
    }
  }
}
