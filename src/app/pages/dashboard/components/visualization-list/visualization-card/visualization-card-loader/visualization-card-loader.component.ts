import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-visualization-card-loader',
  templateUrl: './visualization-card-loader.component.html',
  styleUrls: ['./visualization-card-loader.component.css']
})
export class VisualizationCardLoaderComponent implements OnInit {

  @Input() visualizationType: string;
  constructor() { }

  ngOnInit() {
  }

}
