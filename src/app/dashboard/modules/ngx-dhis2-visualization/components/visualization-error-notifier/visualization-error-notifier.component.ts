import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'visualization-error-notifier',
  templateUrl: './visualization-error-notifier.component.html',
  styleUrls: ['./visualization-error-notifier.component.css']
})
export class VisualizationErrorNotifierComponent implements OnInit {
  @Input() errorMessage: any;
  @Input() titleMessage: string;
  constructor() {
    this.titleMessage =
      'There was a problem processing the data and it can\'t be displayed. Please try again later';
  }

  ngOnInit() {}
}
