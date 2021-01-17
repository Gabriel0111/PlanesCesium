import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AppState} from '../../../store/appState';
import {Plane} from '../../core/plane.model';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html'
})
export class PlanesComponent implements OnInit {
  planesList: Observable<Plane[]>;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.planesList = this.store.select('planes').pipe(map(data => data.planes));
  }
}
