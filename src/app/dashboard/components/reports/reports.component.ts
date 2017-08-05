import {Component, Input, OnInit} from '@angular/core';
import {Visualization} from '../../model/visualization';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  private _reports: any[];
  constructor() { }

  ngOnInit() {
    this._reports = this.visualizationObject.layers[0].settings.reports;
  }


  get reports(): any[] {
    return this._reports;
  }

  set reports(value: any[]) {
    this._reports = value;
  }
}
