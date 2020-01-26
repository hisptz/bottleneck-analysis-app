import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Legend } from 'src/app/models/legend.model';

@Component({
  selector: 'app-legend-definition-list',
  templateUrl: './legend-definition-list.component.html',
  styleUrls: ['./legend-definition-list.component.scss'],
})
export class LegendDefinitionListComponent implements OnInit {
  @Input() legendDefinitions: Legend[];

  @Output() updateLegendDefinitions: EventEmitter<Legend[]> = new EventEmitter<
    Legend[]
  >();
  constructor() {}

  ngOnInit() {}

  onSetColor(color: string, legendId: string) {
    this._updateLegendConfigurations(legendId, { color });
  }

  onSetName(e, legendId: string) {
    e.stopPropagation();
    this._updateLegendConfigurations(legendId, {
      name: e.target ? e.target.value : '',
    });
  }

  private _updateLegendConfigurations(id: string, changes: Partial<Legend>) {
    const newLegendDefinitions = this.legendDefinitions.map(
      (legendDefinition: Legend) => {
        return legendDefinition.id === id
          ? {
              ...legendDefinition,
              ...changes,
            }
          : legendDefinition;
      }
    );

    this.updateLegendDefinitions.emit(newLegendDefinitions);
  }
}
