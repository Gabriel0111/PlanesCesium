import {Injectable} from '@angular/core';
import {Cartesian2, Cartesian3, ConstantProperty, Entity, EntityCollection, LabelStyle, NearFarScalar, VerticalOrigin} from 'cesium';
import {
  FAR,
  FAR_VALUE,
  FONT_LABEL,
  ID_SELECTED_SHADOW,
  LABEL_OFFSET_X,
  LABEL_OFFSET_Y,
  NEAR,
  NEAR_VALUE,
  SCALE_BILLBOARD
} from './constants';
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
        position: Cartesian3.fromDegrees(plane.position.latitude, plane.position.longitude, plane.position.altitude),
        billboard: {
          image: plane.imgURL,
          scale: SCALE_BILLBOARD,
          color: plane.color,
          scaleByDistance: new NearFarScalar(NEAR, NEAR_VALUE, FAR, FAR_VALUE),
        },
        label: {
          text: plane.name,
          font: FONT_LABEL,
          style: LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: VerticalOrigin.BOTTOM,
          pixelOffset: new Cartesian2(LABEL_OFFSET_X, LABEL_OFFSET_Y)
        },
      });
      entities.add(planeEntity);
    }
    return entities;
  }

  generateShadow(plane: Plane): Entity {
    return new Entity({
      id: ID_SELECTED_SHADOW,
      position: Cartesian3.fromDegrees(plane.position.latitude, plane.position.longitude, plane.position.altitude),
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
}
