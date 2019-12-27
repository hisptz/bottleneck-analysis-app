import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { colorBrewer } from '../../utils/colorBrewer';

@Component({
  selector: 'app-map-style',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './map-style.component.html',
  styleUrls: ['./map-style.component.css'],
})
export class MapStyleComponent implements OnInit {
  @Input() selectedLayer;
  @Input() legendSets;
  @Input() isloading = false;
  @Input() justUpdated = false;
  @Output() styleUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() styleFilterClose: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();
  classifications = [
    { method: 2, name: 'Equal interval' },
    { method: 3, name: 'Equal counts' },
  ];
  classes = [3, 4, 5, 6, 7, 8, 9];
  default_color = 'YlOrBr';
  dropDownIsOpen = false;
  fontStyleActive: boolean;
  fontWeightActive: boolean;
  currentLegendSet: any;
  isAutomatic: boolean;
  legendProperties;
  displaySettings;
  layerOptions;

  colors = Object.keys(colorBrewer);
  constructor() {}

  ngOnInit() {
    if (this.selectedLayer) {
      const {
        displaySettings,
        legendProperties,
        legendSet,
        layerOptions,
      } = this.selectedLayer;
      this.displaySettings = { ...displaySettings };
      this.legendProperties = { ...legendProperties };
      this.layerOptions = { ...layerOptions };
      this.isAutomatic = legendSet ? false : true;
      this.currentLegendSet = legendSet;
      this.fontStyleActive = !(
        this.displaySettings.labelFontStyle === 'normal'
      );
      this.fontWeightActive = !(
        this.displaySettings.labelFontWeight === 'normal'
      );
      if (this.legendProperties.classes) {
        this.default_color = Object.keys(colorBrewer).filter(
          key =>
            colorBrewer[key][this.legendProperties.classes].join(',') ===
            this.legendProperties.colorScale
        )[0];
      }
    }
  }

  onChange(method) {
    this.legendProperties = {
      ...this.legendProperties,
      method: Number(method),
    };
  }

  onChangeClass(classes) {
    this.legendProperties = {
      ...this.legendProperties,
      classes: Number(classes),
    };
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
    return (
      this.legendProperties.colorScale &&
      this.legendProperties.colorScale.split(',')
    );
  }

  onColorChange(labelFontColor) {
    this.displaySettings = { ...this.displaySettings, labelFontColor };
  }

  toggleShowLabel(event) {
    event.stopPropagation();
    const labels = event.target.checked;
    this.displaySettings = { ...this.displaySettings, labels };
  }

  toggleShowValues(event) {
    event.stopPropagation();
    const values = event.target.checked;
    this.displaySettings = { ...this.displaySettings, values };
  }

  onFontSizeChange(labelFontSize) {
    this.displaySettings = {
      ...this.displaySettings,
      labelFontSize: `${labelFontSize}px`,
    };
  }

  getNumberFromFontSize(fontSize) {
    return fontSize ? fontSize.split('px')[0] : fontSize;
  }

  toggleFontWeight(FontWeight) {
    const labelFontWeight = FontWeight === 'bold' ? undefined : 'bold';
    this.displaySettings = { ...this.displaySettings, labelFontWeight };
  }

  toggleFontStyle(FontStyle) {
    const labelFontStyle = FontStyle === 'normal' ? 'italic' : 'normal';
    this.displaySettings = { ...this.displaySettings, labelFontStyle };
  }

  onRadiusLowChange(radiusLow) {
    this.layerOptions = { ...this.layerOptions, radiusLow: Number(radiusLow) };
  }
  onRadiusHighChange(radiusHigh) {
    this.layerOptions = {
      ...this.layerOptions,
      radiusHigh: Number(radiusHigh),
    };
  }

  onSubmit(e) {
    e.stopPropagation();
    const classSize = this.legendProperties.classes;
    const colorArray = this.getColors(this.default_color, classSize);
    const colorScale = colorArray.join(',');
    const colorLow = colorArray[0];
    const colorHigh = colorArray[colorArray.length - 1];
    this.legendProperties = {
      ...this.legendProperties,
      colorScale,
      colorLow,
      colorHigh,
    };
    const layer = {
      ...this.selectedLayer,
      layerOptions: this.layerOptions,
      legendSet: this.currentLegendSet,
      legendProperties: this.legendProperties,
      displaySettings: this.displaySettings,
    };
    if (this.isAutomatic) {
      delete layer.legendSet;
    }
    this.styleUpdate.emit({ layer });
  }

  onCanceling(e) {
    e.stopPropagation();
    this.styleFilterClose.emit(true);
  }

  toggleAtomatic(isAutomatic) {
    this.isAutomatic = !this.isAutomatic;
  }

  onChangeLegend(id) {
    this.currentLegendSet = this.legendSets.filter(lg => lg.id === id)[0];
  }
}
