import {Injectable} from '@angular/core';
import {Plane} from '../planes/plane.model';
import {CompositeEntityCollection, ConstantProperty, Entity, EntityCollection} from 'cesium';
import * as Cesium from 'cesium';

@Injectable({
  providedIn: 'root'
})
export class GenerateEntityService {

  constructor() {
  }

  generateDescription(planes: Plane[]): ConstantProperty {
    let description = '<h3>Distance From Other Planes</h3><hr><ul>';

    planes.sort((p1, p2) => p1.distanceFromSelectedPlane - p2.distanceFromSelectedPlane)
      .forEach(plane => plane.distanceFromSelectedPlane
        ? description += `<li><span style="color: ${plane.color.toCssColorString()}">${plane.name}</span>: ` +
          `<b>${plane.distanceFromSelectedPlane} m</b></li>`
        : 1 + 1);

    description += '</ul>';

    return new ConstantProperty(description);
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
          scaleByDistance: new Cesium.NearFarScalar(9000, 2, 12e5, 1.2),
        },
        label: {
          text: plane.name,
          font: '10pt Arial',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 3,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, 40)
        }
      });

      entities.add(planeEntity);
    }

    return entities;
  }

  generateShadow(plane: Plane): Entity {
    return new Entity({
      id: 'shadowSelectedPlane',
      position: Cesium.Cartesian3.fromDegrees(plane.position.latitude, plane.position.longitude, plane.position.altitude),
      ellipse: {
        semiMinorAxis: 750000,
        semiMajorAxis: 750000,
        material: Cesium.Color.RED,
        // material: plane.color.withAlpha(0.38)
      }
    });
  }

}
