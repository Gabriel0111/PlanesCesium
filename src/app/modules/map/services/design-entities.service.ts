import * as Cesium from 'cesium';
import {Injectable} from '@angular/core';
import {ConstantProperty, Entity, EntityCollection} from 'cesium';
import {Plane} from '../planes/plane.model';
import {GenerateEntityService} from '../core/generate-entity.service';
import {PlanesService} from '../planes/planes.service';
import {ID_SELECTED_SHADOW} from '../core/constants';

@Injectable({
  providedIn: 'root'
})
export class DesignEntitiesService {

  constructor(private generateEntityService: GenerateEntityService,
              private planesService: PlanesService) {
  }

  private linesID: string[] = [];

  decreaseEntity(entity: Entity, plane: Plane): void {
    entity.billboard.color = new ConstantProperty(
      new Cesium.Color(plane.color.red, plane.color.green, plane.color.blue, 0.4));
    entity.label.show = new ConstantProperty(false);
  }

  increaseEntity(entity: Entity, plane: Plane): void {
    entity.billboard.color = new ConstantProperty(
      new Cesium.Color(plane.color.red, plane.color.green, plane.color.blue));
    entity.label.show = new ConstantProperty(true);
  }

  addDescription(entity: Entity, planes: Plane[]): void {
    entity.description = this.generateEntityService.generateDescription(planes);
  }

  addShadow(entity: Plane): void {
    const shadowEntity = this.generateEntityService.generateShadow(entity);
    this.planesService.drawEntities(shadowEntity);
  }

  removeShadow(): void {
    this.planesService.removeEntities(ID_SELECTED_SHADOW);
  }

  addLinesPlanesFamily(selectedPlane: Plane, planesFamily: Plane[]): void {
    const listLines: EntityCollection = new EntityCollection();

    planesFamily.forEach(plane => {
        const line = this.generateEntityService.generateLine(selectedPlane, plane);
        this.linesID.push(line.id);
        listLines.add(line);
      }
    );

    this.planesService.drawEntities(listLines);
  }

  removeLinesPlanesFamily(): void {
    this.planesService.removeEntities(this.linesID);
  }
}
