import {Action} from '@ngrx/store';
import {Plane} from '../modules/planes/plane.model';

export const ADD_PLANES = 'ADD_PLANES';
export const UPDATE_PLANES = 'UPDATE_PLANES';
export const SELECTED_PLANE = 'SELECTED_PLANE';
export const UNSELECTED_PLANE = 'UNSELECTED_PLANE';

export class AddPlanes implements Action {
  readonly type: string = ADD_PLANES;

  constructor(public payload: Plane[]) {
  }
}

export class UpdatePlanes implements Action {
  readonly type: string = UPDATE_PLANES;

  constructor(public payload: Plane[]) {
  }
}

export class SelectedPlane implements Action {
  readonly type: string = SELECTED_PLANE;

  constructor(public payload: string) {
  }
}

export class UnselectedPlane implements Action {
  readonly type: string = UNSELECTED_PLANE;
}

export type PlanesActions = AddPlanes | UpdatePlanes |  UnselectedPlane ;
