import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-visualization-downloads-section',
  templateUrl: './visualization-downloads-section.component.html',
  styleUrls: ['./visualization-downloads-section.component.scss']
})
export class VisualizationDownloadsSectionComponent implements OnInit {
  @Input()
  visualizationType: string;
  @Output()
  downloadVisualization: EventEmitter<string> = new EventEmitter<string>();
  showDownloadOptions: boolean;
  constructor() {
    this.showDownloadOptions = false;
  }

  ngOnInit() {}

  toggleDownloadOptions(e) {
    e.stopPropagation();
    this.showDownloadOptions = !this.showDownloadOptions;
  }

  download(e, downloadFormat) {
    e.stopPropagation();
    this.downloadVisualization.emit(downloadFormat);
  }
}
