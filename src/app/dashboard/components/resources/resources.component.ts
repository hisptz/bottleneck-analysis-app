import { Component, OnInit, Input } from '@angular/core';
import {Visualization} from '../../model/visualization';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  private _resources: any[];
  constructor() { }

  ngOnInit() {
    this._resources = this.visualizationObject.layers[0].settings.resources;
  }


  get resources(): any[] {
    return this._resources;
  }

  set resources(value: any[]) {
    this._resources = value;
  }
}
