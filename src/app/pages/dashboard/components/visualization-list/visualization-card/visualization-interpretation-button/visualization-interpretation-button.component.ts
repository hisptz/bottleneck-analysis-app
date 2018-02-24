import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../../store/app.reducers';
import * as visualizationActions from '../../../../../../store/visualization/visualization.actions';

@Component({
  selector: 'app-visualization-interpretation-button',
  templateUrl: './visualization-interpretation-button.component.html',
  styleUrls: ['./visualization-interpretation-button.component.css']
})
export class VisualizationInterpretationButtonComponent implements OnInit {

  @Input() loaded: boolean;
  @Input() visualizationId: string;
  @Input() visualizationLayers: any[] = [];
  interpretationCount: number;
  interpretationTitle: string;
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    if (this.visualizationLayers.length > 0) {
      this.interpretationCount = this.visualizationLayers
        .map((layer: any) => layer.interpretation)
        .map((interpretation: any) => interpretation.interpretations.length)
        .reduce((sum, x) => sum + x);

      this.interpretationTitle = this.interpretationCount > 0 ?
        this.interpretationCount + ' interpretation' + (this.interpretationCount > 1 ? 's' : '') :
        'Write interpretation';
    }
  }

  toggleInterpretation(e) {
    e.stopPropagation();
    this.store.dispatch(new visualizationActions.ToggleInterpretationAction(this.visualizationId));
  }

}
