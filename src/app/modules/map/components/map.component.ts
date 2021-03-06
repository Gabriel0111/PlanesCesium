import * as Cesium from 'cesium';
import {AfterViewChecked, Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {map, skipWhile, take} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {PlanesService} from '../../planes/services/planes.service';
import {AppState} from '../../../store/appState';
import {GenerateEntityService} from '../../core/generate-entity.service';
import {DesignEntitiesService} from '../services/design-entities.service';
import {PlaneState} from '../../../store/planes.reducers';
import {Plane} from '../../core/plane.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnDestroy, OnInit {
  planeEntities = new Cesium.EntityCollection();

  constructor(private planesService: PlanesService, private store: Store<AppState>,
              private generateEntityService: GenerateEntityService, private designEntitiesService: DesignEntitiesService) {
  }

  ngOnInit(): void {
    this.planesService.cesiumViewerInit$.pipe(take(1)).subscribe(() => {
      this.initEntities();
    });

    this.planesService.getSelectedPlane().pipe(take(1))
      .subscribe(() => this.changeEntities());
  }

  ngOnDestroy(): void {
    this.planesService.removeAll();
  }

  private initEntities(): void {
    this.store.select('planes').pipe(
      skipWhile(data => data.planes.length < 1),
      take(1),
      map(data => data.planes))
      .subscribe(planes => {
        this.planeEntities = this.generateEntityService.generateEntitiesFromPlanes(planes);
        this.planesService.drawEntities(this.planeEntities);
      });
  }

  private changeEntities(): void {
    this.store
      .select('planes')
      .pipe(skipWhile(data => data.planes.length < 1))
      .subscribe(data => {

        if (data.selected) {
          this.clearPlanes(data);
        }

        if (data.selectedPlane) {
          this.drawPlanes(data);
        } else {
          this.clearPlanes(data);
        }

      });
  }

  private drawPlanes(data: PlaneState): void {
    // Decrease all not-same selectedPlane family
    data.planes
      .filter((plane) => !data.selectedPlanesFamily.includes(plane))
      .forEach((planeNotFamily: Plane) => {
        this.designEntitiesService.decreaseEntity(
          this.planeEntities.getById(planeNotFamily.id),
          planeNotFamily);
      });

    this.designEntitiesService.addDescription(
      this.planeEntities.getById(data.selectedPlane.id),
      data.selectedPlanesFamily);
    this.designEntitiesService.addLinesPlanesFamily(data.selectedPlane, data.selectedPlanesFamily);
    this.designEntitiesService.addShadow(data.selectedPlane);
  }

  private clearPlanes(data: PlaneState): void {
    data.planes
      .forEach(planeNotFamily => {
        this.designEntitiesService.increaseEntity(
          this.planeEntities.getById(planeNotFamily.id),
          planeNotFamily);
      });

    this.designEntitiesService.removeLinesPlanesFamily();
    this.designEntitiesService.removeShadow();
  }

}
