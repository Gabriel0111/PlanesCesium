import {Injectable} from '@angular/core';
import {DEST_ALT, DEST_LAT, DEST_LNG} from '../../core/constants';
import {Cartesian3, createWorldImagery, Entity, EntityCollection, IonWorldImageryStyle, Viewer} from 'cesium';
import {take} from 'rxjs/operators';
import {SelectedPlane, UnselectedPlane} from '../../../store/planes.actions';
import {Observable, Subject} from 'rxjs';
import {AppState} from '../../../store/appState';
import {Store} from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  readonly postRenderSubject$: Subject<void>;
  readonly cesiumViewerInit$: Subject<void>;
  readonly selectedPlane$: Subject<Entity>;
  readonly planesEntities$: Subject<EntityCollection>;
  private viewer$: Subject<Viewer>;
  private viewer: Viewer;

  constructor(private store: Store<AppState>) {
    this.postRenderSubject$ = new Subject<void>();
    this.cesiumViewerInit$ = new Subject<void>();
    this.selectedPlane$ = new Subject<Entity>();
    this.planesEntities$ = new Subject<EntityCollection>();
    this.viewer$ = new Subject<Viewer>();
  }

  initMap(htmlElement: HTMLElement): void {
    this.viewer = new Viewer(htmlElement, {
      imageryProvider: createWorldImagery({
        style: IonWorldImageryStyle.AERIAL,
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
      destination: Cartesian3.fromDegrees(DEST_LNG, DEST_LAT, DEST_ALT)
    });

    this.initSubscriptions();
    this.cesiumViewerInit$.next();
  }

  private initSubscriptions(): void {
    this.viewer.scene.postRender.addEventListener(() => this.postRenderSubject$.next());

    this.viewer.selectedEntityChanged.addEventListener((plane: Entity) => {
      this.postRenderSubject$.pipe(take(1))
        .subscribe(() => {
          this.selectedPlane$.next(plane ?? null);
          this.store.dispatch(plane ? new SelectedPlane(plane.id) : new UnselectedPlane());
        });
    });

    this.viewer$.next(this.viewer);
  }

  getSelectedPlanes$(): Observable<Entity> {
    return this.selectedPlane$.asObservable();
  }

  getViewer$(): Observable<Viewer> {
    return this.viewer$.asObservable();
  }
}
