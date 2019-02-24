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
      'Aw, Snap. We are sorry for this inconvenience, our server tells us that';
  }

  ngOnInit() {}
}
