import {Injectable} from "@angular/core";
/**
 * Created by mpande on 3/8/18.
 */
@Injectable()
export class GeoJson {
  point() {
    return this.justType('Point', 'POINT');
  }

  line() {
    return this.justType('LineString', 'POLYLINE');
  }


  polygon() {
    return this.justType('Polygon', 'POLYGON');
  }


  multipolygon() {
    return this.justType('MultiPolygon', 'POLYGONZ');
  }

  private justType(type, TYPE) {
    return (geoJson) => {
      const ofType = geoJson.features.filter(this.isType(type));

      return {
        geometries: (TYPE === 'POLYGON' || TYPE === 'POLYLINE') ? [ofType.map(this.justCoordinates)] : ofType.map(this.justCoordinates),
        properties: ofType.map(this.justProps),
        type: TYPE
      };
    };
  }

  private justCoordinates(feature) {
    if (feature.geometry.coordinates[0] !== undefined && feature.geometry.coordinates[0][0] !== undefined && feature.geometry.coordinates[0][0][0] !== undefined) {
      return feature.geometry.coordinates[0];
    } else {
      return feature.geometry.coordinates;
    }
  }

  isType(type) {
    return (feature) => {
      return feature.geometry.type;
    };
  }

  justProps(type) {
    return type.properties;
  }
}
