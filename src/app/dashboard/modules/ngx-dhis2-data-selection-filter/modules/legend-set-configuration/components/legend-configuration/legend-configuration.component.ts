import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Legend } from '../../models/legend-set';

@Component({
  selector: 'app-legend-configuration',
  templateUrl: './legend-configuration.component.html',
  styleUrls: ['./legend-configuration.component.css']
})
export class LegendConfigurationComponent implements OnInit {
  @Input()
  legend: Legend;

  color: string;
  name: string;
  startValue: number;
  endValue: number;

  @Output()
  legendUpdates = new EventEmitter();

  constructor() {}

  onColorSelect(color: string) {
    this.color = color;
    this.onLegendUpdate();
  }

  onLegendUpdate() {
    const { id } = this.legend;
    const color = this.color;
    const name = this.name;
    const startValue = this.startValue;
    const endValue = this.endValue;
    this.legendUpdates.emit({ id, color, name, startValue, endValue });
  }

  ngOnInit() {
    if (this.legend) {
      const { color } = this.legend;
      const { name } = this.legend;
      const { startValue } = this.legend;
      const { endValue } = this.legend;
      this.color = color;
      this.name = name;
      this.endValue = endValue;
      this.startValue = startValue;
    }
  }
}
