import {Injectable} from '@angular/core';
import {PlaneState} from '../../../store/planes.reducers';
import {Plane} from '../../core/plane.model';
import {DesignEntitiesService} from '../../map/services/design-entities.service';
import {EntityCollection} from 'cesium';
import {LinesService} from '../../map/services/lines.service';
import {MapService} from '../../map/services/map.service';

@Injectable({
  providedIn: 'root'
})
export class HandlePlanesEntitiesService {
  private planeEntities: EntityCollection;

  constructor(private designEntitiesService: DesignEntitiesService,
              private linesService: LinesService,
              private mapService: MapService) {
    this.mapService.planesEntities$.subscribe((planesEntities: EntityCollection) =>
      this.planeEntities = planesEntities);
  }

  drawPlanes(data: PlaneState): void {
    data.planes.filter((plane: Plane) => !data.selectedPlanesFamily.includes(plane))
      .forEach((planeNotFamily: Plane) => {
        this.designEntitiesService.decreaseEntity(
          this.planeEntities.getById(planeNotFamily.id),
          planeNotFamily);
      });

    this.designEntitiesService.addDescription(
      this.planeEntities.getById(data.selectedPlane.id),
      data.selectedPlanesFamily);
    this.linesService.addLinesPlanesFamily(data.selectedPlane, data.selectedPlanesFamily);
    this.designEntitiesService.addShadow(data.selectedPlane);
  }

  clearPlanes(data: PlaneState): void {
    console.log(data);

    data.planes.filter((plane: Plane) => !data.previousSelectedPlanes.includes(plane))
      .forEach((planeNotFamily: Plane) => {
        this.designEntitiesService.increaseEntity(
          this.planeEntities.getById(planeNotFamily.id),
          planeNotFamily);
      });

    this.linesService.removeLinesPlanesFamily();
    this.designEntitiesService.removeShadow();
  }
}
