import { Injectable } from '@angular/core';
import {Plane} from '../../core/plane.model';
import {Cartesian3, Color, Entity, EntityCollection} from 'cesium';
import {HandleEntitiesService} from './handle-entities.service';

@Injectable({
  providedIn: 'root'
})
export class LinesService {
  constructor(private handleEntitiesService: HandleEntitiesService) { }

  private linesID: string[] = [];

  generateLine(fromPlane: Plane, toPlane: Plane): Entity {
    const fromPosition: number[] = [fromPlane.position.latitude, fromPlane.position.longitude];
    const toPosition: number[] = [toPlane.position.latitude, toPlane.position.longitude];

    return new Entity({
      polyline: {
        positions: Cartesian3.fromDegreesArray([...fromPosition, ...toPosition]),
        width: 2,
        material: fromPlane.color.darken(0.4, new Color()),
      }
    });
  }

  addLinesPlanesFamily(selectedPlane: Plane, planesFamily: Plane[]): void {
    const listLines: EntityCollection = new EntityCollection();

    planesFamily.forEach(plane => {
        const line = this.generateLine(selectedPlane, plane);
        this.linesID.push(line.id);
        listLines.add(line);
      }
    );

    this.handleEntitiesService.drawEntities(listLines);
  }

  removeLinesPlanesFamily(): void {
    this.handleEntitiesService.removeEntities(this.linesID);
  }
}
