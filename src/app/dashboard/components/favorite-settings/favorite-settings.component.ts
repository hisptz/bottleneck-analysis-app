import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';

export const CHART_TYPES = [
  {name: 'line', value: 'line', selected: false},
  {name: 'bar', value: 'bar', selected: false},
  {name: 'column', value: 'column', selected: false},
  {name: 'spline', value: 'spline', selected: false},
]

@Component({
  selector: 'app-favorite-settings',
  templateUrl: './favorite-settings.component.html',
  styleUrls: ['./favorite-settings.component.css']
})
export class FavoriteSettingsComponent implements OnInit {

  favoriteOptions: any[] = [{}];
  @Input() visualizationType: string;
  @Input() visualizationSettings: any[];
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSettingsUpdate: EventEmitter<any> = new EventEmitter<any>();
  activeSetting: string;
  chartTypes: any[] = CHART_TYPES;
  showChartTypes: boolean = false;
  constructor() {

  }

  ngOnInit() {
    if (this.visualizationSettings) {
      this.activeSetting = this.visualizationSettings[0].id;
      this.visualizationSettings = this.prepareAdditionalOptions(this.visualizationSettings, this.visualizationType)
    }
  }

  prepareAdditionalOptions(visualizationSettings, visualizationType) {
    switch (visualizationType) {
      case 'CHART': {
        const newVisualizationSettings = _.clone(visualizationSettings);
        newVisualizationSettings.forEach((visualizationSetting: any) => {
          if (!visualizationSetting.selectedChartTypes) {
            visualizationSetting.selectedChartTypes = [];
          }

          console.log(visualizationSetting.series, visualizationSetting.columns)

          if (!visualizationSetting.useMultipleAxis) {
            visualizationSetting.useMultipleAxis = false;
          }
        });
        return newVisualizationSettings;
      }

      default:
        return visualizationSettings
    }
  }

  addOption() {
    this.favoriteOptions.push({})
  }

  removeOption(index) {
    this.favoriteOptions.splice(index, 1)
  }

  close() {
    this.onClose.emit(true)
  }

  updateVisualizationSettings() {
    this.onSettingsUpdate.emit(this.visualizationSettings);
  }

  mapToPlainObject(favoriteOptions) {
    const favoriteOptionObject: any = {};
    if (favoriteOptions) {
      favoriteOptions.forEach(option => {
        favoriteOptionObject[option.key] = option.value;
      })
    }
    return favoriteOptionObject
  }

  toggleChartSelection(chartType: any, settingId) {
    const chartTypeIndex = _.findIndex(this.chartTypes, chartType);
    if (chartTypeIndex !== -1) {
      chartType.selected = !chartType.selected;
      this.chartTypes[chartTypeIndex] = chartType;
    }
    const currentSetting = _.find(this.visualizationSettings, ['id', settingId]);
    if (currentSetting) {
      const currentSettingIndex = _.findIndex(this.visualizationSettings, currentSetting);
      currentSetting.selectedChartTypes = this.chartTypes.filter(selectedChartType => { return selectedChartType.selected});
      this.visualizationSettings[currentSettingIndex] = currentSetting;
    }
  }

}
