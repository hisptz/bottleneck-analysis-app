import {Component, Input, OnInit} from '@angular/core';
import {Visualization} from '../../model/visualization';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  private _appUrl: string;
  constructor() { }

  ngOnInit() {
    this._appUrl = '../../../api/apps/' + this.visualizationObject.details.appKey + '/index.html?dashboardItemId=' + this.visualizationObject.id;
  }


  get appUrl(): string {
    return this._appUrl;
  }

  set appUrl(value: string) {
    this._appUrl = value;
  }
}
