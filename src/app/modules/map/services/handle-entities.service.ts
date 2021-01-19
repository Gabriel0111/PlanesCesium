import {Injectable} from '@angular/core';
import {Entity, EntityCollection, Viewer} from 'cesium';
import {MapService} from './map.service';

@Injectable({
  providedIn: 'root'
})
export class HandleEntitiesService {
  private viewer: Viewer;

  constructor(private mapService: MapService) {
    this.mapService.getViewer$().subscribe((viewer: Viewer) =>
      this.viewer = viewer);
  }

  drawEntity(entity: Entity): void {
    if (this.viewer) {
      this.viewer.entities.add(entity);
    }
  }

  drawEntities(entities: EntityCollection): void {
    if (this.viewer) {
      entities.values.forEach((entity: Entity) => this.viewer.entities.add(entity));
    }
  }

  removeEntity(id: string): void {
    if (this.viewer) {
      this.viewer.entities.removeById(id);
    }
  }

  removeEntities(ids: string[]): void {
    if (this.viewer) {
      ids.forEach(id => this.viewer.entities.removeById(id));
    }
  }
}
