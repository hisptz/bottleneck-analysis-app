import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-visualization-widget',
  templateUrl: './visualization-widget.component.html',
  styleUrls: ['./visualization-widget.component.scss']
})
export class VisualizationWidgetComponent implements OnInit {
  @Input()
  id: string;
  @Input()
  appUrl: string;
  @Input()
  height: string;
  constructor() {}

  ngOnInit() {}
}
