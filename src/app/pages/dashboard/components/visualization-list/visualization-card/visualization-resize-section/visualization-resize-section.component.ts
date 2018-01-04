import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-visualization-resize-section',
  templateUrl: './visualization-resize-section.component.html',
  styleUrls: ['./visualization-resize-section.component.css']
})
export class VisualizationResizeSectionComponent implements OnInit {

  @Input() dashboardId: string;
  @Input() visualizationId: string;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  toggleFullScreen(e) {
    e.stopPropagation();
    this.router.navigate([`/dashboards/${this.dashboardId}/item/${this.visualizationId}`]);
  }

}
