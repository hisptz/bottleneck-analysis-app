import { Injectable } from '@angular/core';
import {MapConfiguration} from '../model/map-configuration';
import {MapVisualizationService} from './map-visualization.service';

@Injectable()
export class MapService {

  constructor(private mapVisualizationService: MapVisualizationService) { }

  public getMapConfiguration(visualizationObject): any {
    const configuration = {
      id: visualizationObject.id,
      name: visualizationObject.name,
      subtitle: visualizationObject.subtitle,
      basemap: visualizationObject.details.hasOwnProperty('basemap') && visualizationObject.details.basemap ? visualizationObject.details.basemap : 'osmlight',
      zoom: visualizationObject.details.hasOwnProperty('zoom') ? visualizationObject.details.zoom : 0,
      latitude: visualizationObject.details.hasOwnProperty('latitude') ? visualizationObject.details.latitude : 0,
      longitude: visualizationObject.details.hasOwnProperty('longitude') ? visualizationObject.details.longitude : 0
    };
    visualizationObject.mapConfiguration = configuration;
    return visualizationObject;
  }

  getMapObject(visualizationDetails) {
    return this.mapVisualizationService.drawMap(visualizationDetails.leafletObject, visualizationDetails.visualizationObject);
  }

}
