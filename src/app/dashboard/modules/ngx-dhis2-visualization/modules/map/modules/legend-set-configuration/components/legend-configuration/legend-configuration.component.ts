import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { Legend } from '../../models/legend-set';
import { DELETE_ICON, GREATER_THAN_ICON, LESS_THAN_ICON } from '../../icons';

@Component({
  selector: 'app-legend-configuration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './legend-configuration.component.html',
  styleUrls: ['./legend-configuration.component.css']
})
export class LegendConfigurationComponent implements OnInit {
  @Input()
  legend: Legend;

  @Input() legendSetType: string;

  color: string;
  pattern: string;
  name: string;
  startValue: number;
  endValue: any;
  patternType: string;

  deleteIcon: string;
  lessThanIcon: string;
  greaterThanIcon: string;

  @Output()
  legendUpdates = new EventEmitter();

  @Output()
  deleteLegend = new EventEmitter();

  constructor() {
    this.deleteIcon = DELETE_ICON;
    this.lessThanIcon = LESS_THAN_ICON;
    this.greaterThanIcon = GREATER_THAN_ICON;
  }

  onColorSelect(color: string) {
    this.color = color;
    this.onLegendUpdate();
  }

  onPatternChange(pattern: string) {
    this.pattern = pattern;
    this.onLegendUpdate();
  }

  setNegativeInfinity() {
    this.startValue = -1.7976931348623157e10308;
    setTimeout(() => {
      this.onLegendUpdate();
    }, 50);
  }

  setPositiveInfinity() {
    this.endValue = 1.7976931348623157e10308;
    this.onLegendUpdate();
  }

  onLegendUpdate() {
    const { id } = this.legend;
    const color = this.color;
    const name = this.name;
    const pattern = this.pattern;
    const startValue =
      this.startValue && !isNaN(this.startValue) && this.startValue !== Number.NEGATIVE_INFINITY ? this.startValue : 0;
    const endValue =
      this.endValue && (!isNaN(this.endValue) || this.endValue === Number.POSITIVE_INFINITY) ? this.endValue : null;
    if ((startValue || startValue === 0) && endValue) {
      this.legendUpdates.emit({ id, color, name, pattern, startValue: Number(startValue), endValue: Number(endValue) });
    }
  }

  onDeleteLegend() {
    const { id } = this.legend;
    this.deleteLegend.emit({ id });
  }

  ngOnInit() {
    const { color, name, startValue, endValue, pattern } = this.legend;
    this.color = color;
    this.name = name;
    this.pattern = pattern || 'circlePattern';
    this.endValue = endValue;
    this.startValue = Number(startValue) >= 0 ? Number(startValue) : 0;
  }
}
