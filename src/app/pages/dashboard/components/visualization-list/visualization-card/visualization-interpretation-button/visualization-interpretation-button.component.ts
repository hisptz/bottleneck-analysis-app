import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-visualization-interpretation-button',
  templateUrl: './visualization-interpretation-button.component.html',
  styleUrls: ['./visualization-interpretation-button.component.css']
})
export class VisualizationInterpretationButtonComponent implements OnInit {

  @Input() loaded: boolean;
  constructor() { }

  ngOnInit() {
  }

}
