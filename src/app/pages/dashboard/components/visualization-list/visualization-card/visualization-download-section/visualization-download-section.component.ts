import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-visualization-download-section',
  templateUrl: './visualization-download-section.component.html',
  styleUrls: ['./visualization-download-section.component.css']
})
export class VisualizationDownloadSectionComponent implements OnInit {

  @Input() visualizationType: string;
  @Output() downloadVisualization: EventEmitter<string> = new EventEmitter<string>();
  showDownloadOptions: boolean;
  constructor() {
    this.showDownloadOptions = false;
  }

  ngOnInit() {
  }

  toggleDownloadOptions(e) {
    e.stopPropagation();
    this.showDownloadOptions = !this.showDownloadOptions;
  }

  download(e, downloadFormat) {
    e.stopPropagation();
    this.downloadVisualization.emit(downloadFormat);
  }

}
