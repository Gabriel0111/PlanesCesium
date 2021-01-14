import {Injectable} from '@angular/core';
import {Plane} from '../planes/plane.model';
import {ConstantProperty, Entity, EntityCollection} from 'cesium';
import * as Cesium from 'cesium';
import {FAR, FAR_VALUE, ID_SELECTED_SHADOW, NEAR, NEAR_VALUE} from './constants';

@Injectable({
  providedIn: 'root'
})
export class GenerateEntityService {
  constructor() {
  }

  generateEntitiesFromPlanes(planes: Plane[]): EntityCollection {
    const entities = new EntityCollection();

    for (const plane of planes) {
      const planeEntity = new Entity({
        id: plane.id,
        name: plane.name,
        position: Cesium.Cartesian3.fromDegrees(plane.position.latitude, plane.position.longitude, plane.position.altitude),
        billboard: {
          image: plane.imgURL,
          scale: 0.07,
          color: plane.color,
          scaleByDistance: new Cesium.NearFarScalar(NEAR, NEAR_VALUE, FAR, FAR_VALUE),
        },
        label: {
          text: plane.name,
          font: '8pt Arial',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, 40)
        },
      });
      entities.add(planeEntity);
    }
    return entities;
  }

  generateShadow(plane: Plane): Entity {
    return new Entity({
      id: ID_SELECTED_SHADOW,
      position: Cesium.Cartesian3.fromDegrees(plane.position.latitude, plane.position.longitude, plane.position.altitude),
      ellipse: {
        semiMinorAxis: 100000,
        semiMajorAxis: 100000,
        material: plane.color.withAlpha(0.38)
      }
    });
  }

  generateDescription(planes: Plane[]): ConstantProperty {
    let description = `<h3>Distance From Other Planes</h3><hr><ul>`;

    planes.sort((p1, p2) => p1.distanceFromSelectedPlane - p2.distanceFromSelectedPlane)
      .forEach(plane => plane.distanceFromSelectedPlane
        ? description += `<li><span style="color: ${plane.color.toCssColorString()}">${plane.name}</span>: ` +
          `<b>${plane.distanceFromSelectedPlane} km</b></li>`
        : 1 + 1);
    description += '</ul>';
    return new ConstantProperty(description);
  }

  generateLine(fromPlane: Plane, toPlane: Plane): Entity {
    const fromPosition = [fromPlane.position.latitude, fromPlane.position.longitude];
    const toPosition = [toPlane.position.latitude, toPlane.position.longitude];

    return new Entity({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray([...fromPosition, ...toPosition]),
        width: 2,
        material: fromPlane.color.darken(0.4, new Cesium.Color()),
      }
    });
  }

}
