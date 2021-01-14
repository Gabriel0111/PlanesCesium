import {
  ADD_PLANES,
  AddPlanes,
  PlanesActions,
  SELECTED_PLANE,
  SelectedPlane, UNSELECTED_PLANE,
} from './planes.actions';
import {Plane} from '../modules/planes/plane.model';
import * as haversineDistance from 'haversine-distance';

export interface PlaneState {
  planes: Plane[];
  selectedPlane: Plane;
  selectedPlanesFamily: Plane[];
  previousSelectedPlanes: Plane[];
  selected: boolean;
}

const initialState: PlaneState = {
  planes: [],
  selectedPlane: null,
  selectedPlanesFamily: [],
  previousSelectedPlanes: [],
  selected: false,
};

export function planesReducers(state = initialState, action: PlanesActions): PlaneState {
  switch (action.type) {
    case ADD_PLANES:
      return {
        ...state,
        planes: [...state.planes, ...(action as AddPlanes).payload]
      };
    case SELECTED_PLANE:
      const selectedPlane = state.planes.find(plane => plane.id === (action as SelectedPlane).payload);

      if (!selectedPlane) return state;

      const selectedPlanesFamily = state.planes.filter(plane => plane.family === selectedPlane.family);
      selectedPlanesFamily.map(plane => plane.distanceFromSelectedPlane = calculateDistance(selectedPlane, plane));

      return {
        ...state,
        selectedPlane,
        previousSelectedPlanes: [],
        selectedPlanesFamily,
        selected: true
      };
    case UNSELECTED_PLANE:
      state.selectedPlanesFamily.map(plane => plane.distanceFromSelectedPlane = undefined);

      return {
        ...state,
        selectedPlane: null,
        selectedPlanesFamily: [],
        previousSelectedPlanes: state.selectedPlanesFamily,
        selected: false,
      };

    default:
      return state;
  }
}

export const calculateDistance = (plane: Plane, neirbyPlane: Plane) => {
  return Math.round(haversineDistance({lat: plane.position.latitude, lng: plane.position.longitude},
    {lat: neirbyPlane.position.latitude, lng: neirbyPlane.position.longitude}) / 1000);
};
