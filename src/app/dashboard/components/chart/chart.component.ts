import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {ChartTemplateComponent} from '../chart-template/chart-template.component';
import {ApplicationState} from '../../../store/application-state';
import {Store} from '@ngrx/store';
import {GetChartConfigurationAction, GetChartObjectAction} from '../../../store/actions';
import {Visualization} from '../../model/visualization';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  @ViewChild(ChartTemplateComponent)
  chartTemplate: ChartTemplateComponent;
  constructor(private store: Store<ApplicationState>) { }

  ngOnInit() {
    if (!this.visualizationObject.details.loaded) {
      if (this.visualizationObject.layers.length > 0) {

        /**
         * Get chart configuration
         */
        this.store.dispatch(new GetChartConfigurationAction({
            visualizationObjectId: this.visualizationObject.id,
            visualizationSettings: this.visualizationObject.layers.map(layer => { return layer.settings})
        }));

        /**
         * Get chart object
         */
        if (this.visualizationObject.details.analyticsLoaded) {
          this.store.dispatch(new GetChartObjectAction(this.visualizationObject))
        }
      }
    }

  }

  resize(shape?) {
    if (this.chartTemplate) {
      this.chartTemplate.reflow(shape ? shape : this.visualizationObject.shape, this.visualizationObject.details.showFullScreen);
    }
  }

}
