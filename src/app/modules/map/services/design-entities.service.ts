import {Injectable} from '@angular/core';
import {Color, ConstantProperty, Entity} from 'cesium';
import {GenerateEntityService} from '../../core/generate-entity.service';
import {Plane} from '../../core/plane.model';
import {ID_SELECTED_SHADOW} from '../../core/constants';
import {HandleEntitiesService} from './handle-entities.service';

@Injectable({
  providedIn: 'root'
})
export class DesignEntitiesService {

  constructor(private generateEntityService: GenerateEntityService,
              private handleEntitiesService: HandleEntitiesService) {
  }

  increaseEntity(entity: Entity, plane: Plane): void {
    entity.billboard.color = new ConstantProperty(
      new Color(plane.color.red, plane.color.green, plane.color.blue));
    entity.label.show = new ConstantProperty(true);
  }

  decreaseEntity(entity: Entity, plane: Plane): void {
    entity.billboard.color = new ConstantProperty(
      new Color(plane.color.red, plane.color.green, plane.color.blue, 0.4));
    entity.label.show = new ConstantProperty(false);
  }

  addDescription(entity: Entity, planes: Plane[]): void {
    entity.description = this.generateEntityService.generateDescription(planes);
  }

  addShadow(entity: Plane): void {
    const shadowEntity: Entity = this.generateEntityService.generateShadow(entity);
    this.handleEntitiesService.drawEntity(shadowEntity);
  }

  removeShadow(): void {
    this.handleEntitiesService.removeEntity(ID_SELECTED_SHADOW);
  }
}
