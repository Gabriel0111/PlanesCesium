import {Component, OnInit} from '@angular/core';
import {PlanesService} from './planes.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/appState';
import {map} from 'rxjs/operators';
import {Plane} from './plane.model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css']
})
export class PlanesComponent implements OnInit {
  planesList: Observable<Plane[]>;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.planesList = this.store.select('planes').pipe(map(data => data.planes));
  }
}
