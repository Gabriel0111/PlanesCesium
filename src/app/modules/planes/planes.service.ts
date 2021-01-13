import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Plane, PlaneFamily} from './plane.model';
import {Store} from '@ngrx/store';
import {AddPlanes} from '../../store/planes.actions';
import {AppState} from '../../store/appState';
import * as Cesium from 'cesium';
import {Entity, EntityCollection, SkyAtmosphere} from 'cesium';
import {skipWhile} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import * as haversineDistance from 'haversine-distance';

@Injectable()
export class PlanesService {
  private viewer: Cesium.Viewer;
  private selectedPlane: Subject<Entity>;

  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.selectedPlane = new Subject<Entity>();
    this.initPlanes();
  }

  private initPlanes(): void {
    this.http.get<Plane[]>('http://localhost:4200/assets/data.json')
      .pipe(skipWhile(data => data.length < 1))
      .subscribe(planes => {
        this.fillDisplayPlaneProperties(planes);
        this.store.dispatch(new AddPlanes(planes));
      });
  }

  private fillDisplayPlaneProperties(planes: Plane[]): any {
    planes.forEach(plane => {
      plane.imgURL = '/assets/' + plane.family.toString().toLowerCase() + '.png';

      switch (plane.family) {
        case PlaneFamily.LAND_FORCE:
          plane.color = Cesium.Color.fromCssColorString('#ff8321');
          break;
        case PlaneFamily.AIR_FORCE:
          plane.color = Cesium.Color.fromCssColorString('#f23a32');
          break;
        case PlaneFamily.CIVILIAN:
          plane.color = Cesium.Color.fromCssColorString('#effd3b');
          break;
      }
    });
  }

  public onSelectedPlane(): Observable<Entity> {
    return this.selectedPlane.asObservable();
  }

  public initMap(el: HTMLElement): void {
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
  }

  public drawPlanes(entities: EntityCollection): void {
    if (this.viewer) {
      for (const entity of entities.values) {
        this.viewer.entities.add(entity);
      }

      this.viewer.selectedEntityChanged.addEventListener(plane => {
        this.selectedPlane.next(plane);
      });
    }
  }

}
