import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visualization-download-section',
  templateUrl: './visualization-download-section.component.html',
  styleUrls: ['./visualization-download-section.component.css']
})
export class VisualizationDownloadSectionComponent implements OnInit {

  showDownloadOptions: boolean;
  constructor() {
    this.showDownloadOptions = false;
  }

  ngOnInit() {
  }

}
