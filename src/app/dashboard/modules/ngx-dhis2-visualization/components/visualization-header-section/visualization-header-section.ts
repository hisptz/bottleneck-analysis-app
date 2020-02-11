import { Component, EventEmitter, Input, Output } from '@angular/core';

import { openAnimation } from '../../../../../animations';

@Component({
  selector: 'visualization-header-section',
  templateUrl: 'visualization-header-section.html',
  styleUrls: ['./visualization-header-section.css'],
  animations: [openAnimation],
})
export class VisualizationHeaderSectionComponent {
  @Input()
  id: string;
  @Input()
  uiConfigId: string;
  @Input()
  hideResizeButtons: boolean;
  @Input()
  fullScreen: boolean;

  @Output()
  fullScreenAction: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  onFullScreenAction(id) {
    this.fullScreenAction.emit({
      id,
      uiConfigId: this.uiConfigId,
      fullScreen: this.fullScreen,
    });
  }
}
