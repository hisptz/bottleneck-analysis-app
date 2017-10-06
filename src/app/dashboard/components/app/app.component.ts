import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Visualization} from '../../model/visualization';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  private _appUrl: string;
  private _appHeight: string;
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this._appUrl = '../../../api/apps/' + this.visualizationObject.details.appKey + '/index.html?dashboardItemId=' + this.visualizationObject.id;

    this._appHeight = this.visualizationObject.details.itemHeight;

    setTimeout(() => {
      this.cd.detach()
    },0)
  }


  get appHeight(): string {
    return this._appHeight;
  }

  set appHeight(value: string) {
    this._appHeight = value;
  }

  get appUrl(): string {
    return this._appUrl;
  }

  set appUrl(value: string) {
    this._appUrl = value;
  }
}
