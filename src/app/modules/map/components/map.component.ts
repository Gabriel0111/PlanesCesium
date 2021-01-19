import {Component, OnInit} from '@angular/core';
import {map, take, skipWhile} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/appState';
import {GenerateEntitiesService} from '../services/generate-entities.service';
import {PlaneState} from '../../../store/planes.reducers';
import {EntityCollection} from 'cesium';
import {MapService} from '../services/map.service';
import {HandleEntitiesService} from '../services/handle-entities.service';
import {HandlePlanesEntitiesService} from '../../planes/services/handle-planes-entities.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(private store: Store<AppState>,
              private generateEntityService: GenerateEntitiesService,
              private mapService: MapService,
              private handleEntitiesService: HandleEntitiesService,
              private handlePlanesEntities: HandlePlanesEntitiesService) {
  }

  ngOnInit(): void {
    this.mapService.cesiumViewerInit$.pipe(take(1)).subscribe(() => {
      this.initEntities();
    });

    this.mapService.getSelectedPlanes$().pipe(take(1))
      .subscribe(() => this.changeEntities());
  }

  private initEntities(): void {
    this.store.select('planes').pipe(
      skipWhile((data: PlaneState) => data.planes.length < 1),
      take(1),
      map(data => data.planes))
      .subscribe(planes => {
        const planeEntities: EntityCollection = this.generateEntityService.generateEntitiesFromPlanes(planes);
        this.mapService.planesEntities$.next(planeEntities);
        this.handleEntitiesService.drawEntities(planeEntities);
      });
  }

  private changeEntities(): void {
    this.store
      .select('planes')
      .pipe(skipWhile((data: PlaneState) => data.planes.length < 1))
      .subscribe((data: PlaneState) => {

        if (data.selected) {
          this.handlePlanesEntities.clearPlanes(data);
        }

        (data.selectedPlane)
          ? this.handlePlanesEntities.drawPlanes(data)
          : this.handlePlanesEntities.clearPlanes(data);
      });
  }
}
