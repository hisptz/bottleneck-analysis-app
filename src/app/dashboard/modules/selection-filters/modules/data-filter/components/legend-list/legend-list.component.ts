import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Legend } from 'src/app/models/legend.model';
import { find } from 'lodash';

@Component({
  selector: 'app-legend-list',
  templateUrl: './legend-list.component.html',
  styleUrls: ['./legend-list.component.scss'],
})
export class LegendListComponent implements OnInit {
  @Input() legends: Legend[];
  @Input() legendDefinitions: Legend[];

  @Output() legendUpdate: EventEmitter<Legend[]> = new EventEmitter<Legend[]>();

  constructor() {}

  get legendList(): any[] {
    return [];
  }

  get legendEntities(): any {
    const legendEntity = {};

    (this.legends || []).forEach((legend: Legend) => {
      legendEntity[legend.id] = legend;
    });
    return legendEntity;
  }

  ngOnInit() {}

  onInputChange(e, legendId: string, attribute: string) {
    e.stopPropagation();
    const availableLegend: Legend = find(this.legends, ['id', legendId]);

    if (availableLegend) {
      const availableLegendIndex = this.legends.indexOf(availableLegend);
      const updatedLegend = {
        ...availableLegend,
        [attribute]: e.target
          ? parseInt(e.target.value, 10)
          : availableLegend[attribute],
      };
      const legends = this.legends.map(
        (legend: Legend, legendIndex: number) => {
          if (legendIndex === availableLegendIndex) {
            return updatedLegend;
          } else if (legendIndex === availableLegendIndex + 1) {
            return { ...legend, endValue: updatedLegend.startValue };
          } else if (legendIndex === availableLegendIndex - 1) {
            return { ...legend, startValue: updatedLegend.endValue };
          }

          return legend;
        }
      );

      this.legendUpdate.emit(legends);
    }
  }
}
