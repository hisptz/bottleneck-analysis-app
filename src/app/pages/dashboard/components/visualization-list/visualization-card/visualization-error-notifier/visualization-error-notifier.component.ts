import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-visualization-error-notifier',
  templateUrl: './visualization-error-notifier.component.html',
  styleUrls: ['./visualization-error-notifier.component.css']
})
export class VisualizationErrorNotifierComponent implements OnInit {

  @Input() errorMessage: any;
  constructor() { }

  ngOnInit() {
  }

}
