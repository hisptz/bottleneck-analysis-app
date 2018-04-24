import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { colorBrewer } from '../../utils/colorBrewer';

@Component({
  selector: 'app-map-style',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './map-style.component.html',
  styleUrls: ['./map-style.component.css']
})
export class MapStyleComponent implements OnInit {
  @Input() selectedLayer;
  @Input() legendSets;
  @Output() onStyleUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onStyleFilterClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  classifications = [{ method: 2, name: 'Equal interval' }, { method: 3, name: 'Equal counts' }];
  classes = [3, 4, 5, 6, 7, 8, 9];
  default_color = 'YlOrBr';
  dropDownIsOpen = false;
  fontStyleActive: boolean;
  fontWeightActive: boolean;
  isAutomatic: boolean;
  legendProperties;
  displaySettings;

  colors = Object.keys(colorBrewer);
  constructor() {}

  ngOnInit() {
    const { displaySettings, legendProperties, legendSet } = this.selectedLayer;
    this.displaySettings = { ...displaySettings };
    this.legendProperties = { ...legendProperties };
    this.isAutomatic = legendSet ? false : true;
    console.log(this.legendSets);
    this.fontStyleActive = !(this.displaySettings.labelFontStyle === 'normal');
    this.fontWeightActive = !(this.displaySettings.labelFontWeight === 'normal');
    if (this.legendProperties.classes) {
      this.default_color = Object.keys(colorBrewer).filter(
        key =>
          colorBrewer[key][this.legendProperties.classes].join(',') ===
          this.legendProperties.colorScale
      )[0];
    }
  }

  onChange(method) {
    this.legendProperties = { ...this.legendProperties, method };
  }

  onChangeClass(classes) {
    this.legendProperties = { ...this.legendProperties, classes };
  }

  onChangeColor(colorDefault) {
    this.default_color = colorDefault;
  }

  toggleDropDown() {
    this.dropDownIsOpen = !this.dropDownIsOpen;
  }

  getColors(key, classSize) {
    return colorBrewer[key][classSize];
  }

  getColorScale() {
    return this.legendProperties.colorScale && this.legendProperties.colorScale.split(',');
  }

  onColorChange(labelFontColor) {
    this.displaySettings = { ...this.displaySettings, labelFontColor };
  }

  toggleShowLabel(event) {
    event.stopPropagation();
    const labels = event.target.checked;
    this.displaySettings = { ...this.displaySettings, labels };
  }

  onFontSizeChange(labelFontSize) {
    this.displaySettings = { ...this.displaySettings, labelFontSize: `${labelFontSize}px` };
  }

  getNumberFromFontSize(fontSize) {
    return fontSize.split('px')[0];
  }

  onSubmit(e) {
    e.stopPropagation();
    const classSize = this.legendProperties.classes;
    const colorArray = this.getColors(this.default_color, classSize);
    const colorScale = colorArray.join(',');
    const colorLow = colorArray[0];
    const colorHigh = colorArray[colorArray.length - 1];
    this.legendProperties = { ...this.legendProperties, colorScale, colorLow, colorHigh };
    const layer = {
      ...this.selectedLayer,
      legendProperties: this.legendProperties,
      displaySettings: this.displaySettings
    };
    this.onStyleUpdate.emit({ layer });
  }
  onCanceling(e) {
    e.stopPropagation();
    this.onStyleFilterClose.emit(true);
  }

  toggleAtomatic(isAutomatic) {
    this.isAutomatic = !this.isAutomatic;
  }

  onChangeLegend(id) {
    console.log(id);
  }
}
