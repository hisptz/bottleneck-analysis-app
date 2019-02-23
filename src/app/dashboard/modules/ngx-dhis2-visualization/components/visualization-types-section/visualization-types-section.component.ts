import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  TABLE_ICON,
  COLUMN_CHART_ICON,
  MAP_ICON,
  INFO_ICON,
  RESHUFFLE_ICON
} from '../../icons';
import { VisualizationTypesConfig } from '../../models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-visualization-types-section',
  templateUrl: './visualization-types-section.component.html',
  styleUrls: ['./visualization-types-section.component.css']
})
export class VisualizationTypesSectionComponent implements OnInit {
  @Input() currentVisualization: string;

  @Input() visualizationTypesConfig: VisualizationTypesConfig;
  @Output()
  visualizationTypeChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() toggleInterpretation = new EventEmitter();
  @Output() visualizationLayoutChange: EventEmitter<any> = new EventEmitter();

  icons: { [name: string]: string };

  constructor() {
    this.icons = {
      TABLE_ICON,
      COLUMN_CHART_ICON,
      MAP_ICON,
      RESHUFFLE_ICON,
      INFO_ICON
    };
  }

  ngOnInit() {}

  onVisualizationSelect(e, type) {
    e.stopPropagation();
    this.visualizationTypeChange.emit(type);
  }

  onToggleInterpretaion(e) {
    e.stopPropagation();
    this.toggleInterpretation.emit();
  }

  onLayoutChange(e) {
    e.stopPropagation();
    this.visualizationLayoutChange.emit();
  }
}
