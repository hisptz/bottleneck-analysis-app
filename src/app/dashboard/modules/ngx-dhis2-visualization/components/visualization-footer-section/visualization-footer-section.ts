import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { openAnimation } from '../../../../../animations';
import { VisualizationTypesConfig } from '../../models';

/**
 * Generated class for the VisualizationFooterSectionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'visualization-footer-section',
  templateUrl: 'visualization-footer-section.html',
  styleUrls: ['./visualization-footer-section.css'],
  animations: [openAnimation]
})
export class VisualizationFooterSectionComponent implements OnInit {
  @Input()
  type: string;
  @Input()
  name: string;
  @Input()
  description: string;
  @Input()
  configId: string;
  @Input()
  hideTypeButtons: boolean;
  @Input()
  hideManagementBlock: boolean;

  @Input()
  hideDownloadBlock: boolean;

  @Input()
  visualizationTypesConfig: VisualizationTypesConfig;

  @Output()
  visualizationTypeChange: EventEmitter<{
    id: string;
    type: string;
  }> = new EventEmitter<{ id: string; type: string }>();

  @Output()
  saveVisualization: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  download: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  removeVisualization: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  layoutChange: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.hideManagementBlock = this.hideTypeButtons = true;
  }

  ngOnInit() {}

  onVisualizationTypeChange(type: string) {
    this.visualizationTypeChange.emit({ id: this.configId, type: type });
  }

  onVisualizationSave(visualizationDetails: any) {
    this.saveVisualization.emit(visualizationDetails);
  }

  onVisualizationRemove(details: any) {
    this.removeVisualization.emit(details);
  }

  onDownload(downloadFormat: string) {
    this.download.emit({ type: this.type, downloadFormat: downloadFormat });
  }

  onVisualizationLayoutChange() {
    this.layoutChange.emit();
  }
}
