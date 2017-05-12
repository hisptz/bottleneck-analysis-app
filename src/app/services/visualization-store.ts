import {Injectable} from "@angular/core";
import {Visualization} from "../model/visualization";
@Injectable()
export class VisualizationStore {
  private _visualizationObjects: Visualization[];
  constructor() {
    this._visualizationObjects = [];
  }

  find(id: string): any {
    let result: any = null;
    if(this._visualizationObjects.length > 0) {
      for(let visualizationObject of this._visualizationObjects) {
        if(visualizationObject.id == id) {
          result = visualizationObject;
          break;
        }
      }
    }
    return result;
  }

  all(): any[] {
    return this._visualizationObjects.length > 0 ? this._visualizationObjects : [];
  }

  createOrUpdate(data: Visualization): void {
    let result = this._visualizationObjects.filter(objectData => {return objectData.id == data.id});

    if(result.length == 0) {
      this._visualizationObjects.push(data)
    } else {
      this._visualizationObjects[this._visualizationObjects.indexOf(result[0])] = data;
    }
  }
}
