import {Component, OnInit} from '@angular/core';
import {PlanesService} from '../planes/planes.service';
import * as Cesium from 'cesium';
import {map, skipWhile, take} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/appState';
import {ConstantProperty, Entity} from 'cesium';
import {SelectedPlane, UnselectedPlane} from '../../store/planes.actions';
import {Plane} from '../planes/plane.model';
import {GenerateEntityService} from './generate-entity.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  planeEntities: Cesium.EntityCollection;
  planes: Plane[];

  constructor(private planesService: PlanesService, private store: Store<AppState>, private generateEntityService: GenerateEntityService) {
    this.planeEntities = new Cesium.EntityCollection();
    this.planes = [];
  }

  ngOnInit(): void {
    this.planesService.onSelectedPlane()
      .pipe(skipWhile(data => !data))
      .subscribe((plane: Entity) => this.onClick(plane));

    this.initEntities();
    this.subscribeColourChanges();
  }

  private initEntities(): void {
    this.store.select('planes').pipe(
      skipWhile(data => data.planes.length < 1),
      take(1),
      map(data => data.planes))
      .subscribe(planes => {
        this.planes = planes;
        this.planeEntities = this.generateEntityService.generateEntitiesFromPlanes(planes);
        this.planesService.drawPlanes(this.planeEntities);
      });
  }

  private onClick(planeEntity: Entity): void {
    if (planeEntity !== undefined) {
      this.store.dispatch(new SelectedPlane(this.planes.find((plane: Plane) => plane.id === planeEntity.id)));
    } else {
      this.store.dispatch(new UnselectedPlane());
    }
  }

  private subscribeColourChanges(): void {
    this.store.select('planes').pipe(
      skipWhile(data => data.planes.length < 1)
    )
      .subscribe(data => {
        console.log(data);

        if (data.selectedPlane) {
          data.planes.filter((plane) => !data.selectedPlanesFamily.includes(plane))
            .forEach(planeNotFamily => {
              const planeEntity: Entity = this.planeEntities.getById(planeNotFamily.id);
              const shodowEntity: Entity = this.planeEntities.getById(planeNotFamily.id + '-shadow');

              planeEntity.billboard.color = new ConstantProperty(
                new Cesium.Color(planeNotFamily.color.red, planeNotFamily.color.green, planeNotFamily.color.blue, 0.3));

              planeEntity.label.show = new ConstantProperty(false);
              shodowEntity.show = true;
            });
          this.planeEntities.getById(data.selectedPlane.id).description = this.generateEntityService.generateDescription(data.selectedPlanesFamily);

        } else {
          data.planes // TODO: Modify
            .forEach(planeNotFamily => {
              const planeEntity: Entity = this.planeEntities.getById(planeNotFamily.id);

              this.planeEntities.getById(planeNotFamily.id).billboard.color = new ConstantProperty(
                new Cesium.Color(planeNotFamily.color.red, planeNotFamily.color.green, planeNotFamily.color.blue));
              planeEntity.label.show = new ConstantProperty(true);
            });
        }
      });
  }


}
