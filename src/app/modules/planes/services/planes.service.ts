import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {skipWhile, take} from 'rxjs/operators';
import {AppState} from '../../../store/appState';
import {Plane} from '../../core/plane.model';
import {AddPlanes} from '../../../store/planes.actions';
import {URL_PLANES_DATA} from '../../core/constants';
import {ColorService} from './color.service';

@Injectable()
export class PlanesService {
  constructor(private http: HttpClient, private store: Store<AppState>,
              private colorService: ColorService) {
  }

  initPlanes(): void {
    this.http.get<Plane[]>(URL_PLANES_DATA)
      .pipe(skipWhile((data: Plane[]) => data.length < 1), take(1))
      .subscribe((planes: Plane[]) => {
        this.fillProperties(planes);
        this.store.dispatch(new AddPlanes(planes));
      });
  }

  private fillProperties(planes: Plane[]): void {
    planes.forEach(plane => {
      plane.imgURL = '/assets/' + plane.family.toString().toLowerCase() + '.png';
      plane.color = this.colorService.colorPlane(plane);
    });
  }
}
