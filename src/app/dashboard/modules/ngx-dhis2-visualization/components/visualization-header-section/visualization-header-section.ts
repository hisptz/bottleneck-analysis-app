import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VisualizationUiConfig } from '../../models/visualization-ui-config.model';
import { VisualizationLayer } from '../../models/visualization-layer.model';
import { VisualizationDataSelection } from '../../models/visualization-data-selection.model';
import { openAnimation } from '../../../../../animations';

import { SelectionFilterConfig } from '../../../ngx-dhis2-data-selection-filter/models/selected-filter-config.model';

@Component({
  selector: 'visualization-header-section',
  templateUrl: 'visualization-header-section.html',
  styleUrls: ['./visualization-header-section.css'],
  animations: [openAnimation]
})
export class VisualizationHeaderSectionComponent {
  @Input()
  id: string;
  @Input()
  name: string;
  @Input()
  isNew: string;
  @Input()
  uiConfigId: string;
  @Input()
  showFilters: boolean;
  @Input()
  hideResizeButtons: boolean;
  @Input()
  fullScreen: boolean;
  @Input()
  visualizationLayer: VisualizationLayer;

  showNameInput: boolean;

  @Output()
  visualizationLayerUpdate: EventEmitter<VisualizationLayer> = new EventEmitter<VisualizationLayer>();

  @Output()
  fullScreenAction: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  savefavorite: EventEmitter<any> = new EventEmitter<any>();

  selectionFilterConfig: SelectionFilterConfig;

  constructor() {
    this.selectionFilterConfig = {
      showPeriodFilter: false,
      showOrgUnitFilter: false,
      showLayout: false
    };
  }

  onFullScreenAction(id) {
    this.fullScreenAction.emit({
      id,
      uiConfigId: this.uiConfigId,
      fullScreen: this.fullScreen
    });
  }

  onFilterUpdateAction(dataSelections: VisualizationDataSelection[]) {
    this.visualizationLayerUpdate.emit({
      ...this.visualizationLayer,
      dataSelections
    });
  }

  onToggleNameInput(e) {
    e.stopPropagation();
    this.showNameInput = !this.showNameInput;
  }

  onSaveFavorite(e) {
    if (this.name.trim() !== '') {
      this.savefavorite.emit({ name: this.name, isNew: this.isNew });
      this.showNameInput = false;
    }
  }
}
