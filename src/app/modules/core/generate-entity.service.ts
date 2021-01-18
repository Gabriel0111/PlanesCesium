import {Injectable} from '@angular/core';
import {ConstantProperty, Entity, EntityCollection} from 'cesium';
import * as Cesium from 'cesium';
import {FAR, FAR_VALUE, ID_SELECTED_SHADOW, NEAR, NEAR_VALUE} from './constants';
import {Plane} from './plane.model';

@Injectable({
  providedIn: 'root'
})
export class GenerateEntityService {
  generateEntitiesFromPlanes(planes: Plane[]): EntityCollection {
    const entities: EntityCollection = new EntityCollection();

    for (const plane of planes) {
      const planeEntity: Entity = new Entity({
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
    let description: string = `<h3>Distance From Other Planes</h3><hr><ul>`;

    planes.sort((p1: Plane, p2: Plane) => p1.distanceFromSelectedPlane - p2.distanceFromSelectedPlane)
      .forEach(plane => plane.distanceFromSelectedPlane
        ? description += `<li><span style="color: ${plane.color.toCssColorString()}">${plane.name}</span>: ` +
          `<b>${plane.distanceFromSelectedPlane} km</b></li>`
        : 1 + 1);
    description += '</ul>';
    return new ConstantProperty(description);
  }

  generateLine(fromPlane: Plane, toPlane: Plane): Entity {
    const fromPosition: number[] = [fromPlane.position.latitude, fromPlane.position.longitude];
    const toPosition: number[] = [toPlane.position.latitude, toPlane.position.longitude];

    return new Entity({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray([...fromPosition, ...toPosition]),
        width: 2,
        material: fromPlane.color.darken(0.4, new Cesium.Color()),
      }
    });
  }

}
