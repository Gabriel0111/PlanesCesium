import {Color} from 'cesium';

export interface Position {
  latitude: number;
  longitude: number;
  altitude: number;
}

export interface Plane {
  id: string;
  name: string;
  position: Position;
  family: PlaneFamily;
  imgURL?: string;
  color?: Color;
  distanceFromSelectedPlane?: number;
}

export enum PlaneFamily {
  LAND_FORCE = 'LAND_FORCE',
  AIR_FORCE = 'AIR_FORCE',
  CIVILIAN = 'CIVILIAN'
}
