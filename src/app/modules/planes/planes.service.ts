import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Plane, PlaneFamily} from './plane.model';
import {Store} from '@ngrx/store';
import {AddPlanes, SelectedPlane, UnselectedPlane} from '../../store/planes.actions';
import {AppState} from '../../store/appState';
import * as Cesium from 'cesium';
import {ConstantProperty, Entity, EntityCollection, SkyAtmosphere} from 'cesium';
import {skipWhile, take} from 'rxjs/operators';
import {AIR_FORCE_COLOR, CIVILIAN_COLOR, LAND_FORCE_COLOR} from '../core/constants';
import {Observable, Subject} from 'rxjs';
import {GenerateEntityService} from '../core/generate-entity.service';

@Injectable()
export class PlanesService {
  private viewer: Cesium.Viewer;
  private selectedPlane: Subject<Entity>;
  private postRenderSubject: Subject<void>;

  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.selectedPlane = new Subject<Entity>();
    this.postRenderSubject = new Subject<void>();

    this.initPlanes();
  }

  private async initPlanes(): Promise<void> {
    this.http.get<Plane[]>('http://localhost:4200/assets/data.json')
      .pipe(skipWhile(data => data.length < 1))
      .subscribe(planes => {
        this.fillDisplayPlaneProperties(planes);
        this.store.dispatch(new AddPlanes(planes));
      });
  }

  private initSubscription(): void {
    this.viewer.scene.postRender.addEventListener(() => this.postRenderSubject.next());

    this.viewer.selectedEntityChanged.addEventListener(plane => {
      this.postRenderSubject.pipe(take(1)).subscribe(() => {
        if (plane) {
          this.selectedPlane.next(plane);
          this.store.dispatch(new SelectedPlane(plane.id));
        } else {
          this.selectedPlane.next(null);
          this.store.dispatch(new UnselectedPlane());
        }
      });
    });
  }

  private fillDisplayPlaneProperties(planes: Plane[]): any {
    planes.forEach(plane => {
      plane.imgURL = '/assets/' + plane.family.toString().toLowerCase() + '.png';

      switch (plane.family) {
        case PlaneFamily.LAND_FORCE:
          plane.color = Cesium.Color.fromCssColorString(LAND_FORCE_COLOR);
          break;
        case PlaneFamily.AIR_FORCE:
          plane.color = Cesium.Color.fromCssColorString(AIR_FORCE_COLOR);
          break;
        case PlaneFamily.CIVILIAN:
          plane.color = Cesium.Color.fromCssColorString(CIVILIAN_COLOR);
          break;
      }
    });
  }

  async initMap(el: HTMLElement): Promise<void> {
    this.viewer = new Cesium.Viewer(el, {
      // terrainProvider: Cesium.createWorldTerrain(),
      imageryProvider: Cesium.createWorldImagery({
        style: Cesium.IonWorldImageryStyle.AERIAL,
      }),
      animation: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      timeline: false,
      navigationHelpButton: false,
      shouldAnimate: false,
      navigationInstructionsInitiallyVisible: false
    });
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(35.238892, 31.770552, 4000000)
    });

    this.initSubscription();
  }

  drawEntities(entities: EntityCollection | Entity): void {
    if (this.viewer) {
      if (entities instanceof EntityCollection) {
        for (const entity of entities.values) {
          this.viewer.entities.add(entity);
        }
      } else if (entities instanceof Entity) {
        this.viewer.entities.add(entities);
      }
    }
  }

  removeEntities(ids: string | string[]): void {
    if (this.viewer) {
      if (typeof ids === 'string') {
        this.viewer.entities.removeById(ids);
      } else if (typeof ids === 'object') {
        ids.forEach(id => this.viewer.entities.removeById(id));
      }
    }
  }

  getSelectedPlane(): Observable<Entity> {
    return this.selectedPlane.asObservable();
  }

}
