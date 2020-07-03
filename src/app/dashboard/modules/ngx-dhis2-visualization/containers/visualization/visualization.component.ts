import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { openAnimation } from '../../../../../animations';
import { VisualizationBodySectionComponent } from '../../components/visualization-body-section/visualization-body-section';
import { updateVisualizationLayerBasedOnLayoutChange } from '../../helpers/update-visualization-based -on-layout-change.helper';
import { LegendSet } from '../../models/legend-set.model';
import { VisualizationConfig } from '../../models/visualization-config.model';
import { VisualizationInputs } from '../../models/visualization-inputs.model';
import { VisualizationLayer } from '../../models/visualization-layer.model';
import { VisualizationProgress } from '../../models/visualization-progress.model';
import { VisualizationUiConfig } from '../../models/visualization-ui-config.model';
import { Visualization } from '../../models/visualization.model';
import { UpdateVisualizationConfigurationAction } from '../../store/actions/visualization-configuration.actions';
import {
  LoadVisualizationAnalyticsAction,
  UpdateVisualizationLayerAction,
} from '../../store/actions/visualization-layer.actions';
import {
  InitializeVisualizationObjectAction,
  SaveVisualizationFavoriteAction,
  UpdateVisualizationObjectAction,
} from '../../store/actions/visualization-object.actions';
import {
  ShowOrHideVisualizationBodyAction,
  ToggleFullScreenAction,
  ToggleVisualizationFocusAction,
} from '../../store/actions/visualization-ui-configuration.actions';
import { VisualizationState } from '../../store/reducers';
import { getCurrentVisualizationConfig } from '../../store/selectors/visualization-configuration.selectors';
import { getCurrentVisualizationObjectLayers } from '../../store/selectors/visualization-layer.selectors';
import {
  getCurrentVisualizationProgress,
  getVisualizationObjectById,
} from '../../store/selectors/visualization-object.selectors';
import {
  getCurrentVisualizationUiConfig,
  getFocusedVisualization,
} from '../../store/selectors/visualization-ui-configuration.selectors';
import { Legend } from 'src/app/models/legend.model';
import { getLegendDefinitionsFromSelections } from '../../helpers/get-legend-definitions-from-selections.helper';
import { InterventionArchive } from 'src/app/dashboard/models/intervention-archive.model';

@Component({
  selector: 'ngx-dhis2-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [openAnimation],
})
export class VisualizationComponent implements OnInit, OnChanges {
  @Input() id: string;
  @Input() type: string;
  @Input() visualizationLayers: VisualizationLayer[];
  @Input() name: string;
  @Input() isNewFavorite: boolean;
  @Input() dashboard: any;
  @Input() currentUser: any;
  @Input() systemInfo: any;
  @Input() selectionSummary: string;
  @Input() downloadFilename: string;
  @Input() currentInterventionArchive: InterventionArchive;

  cardFocused: boolean;

  @ViewChild(VisualizationBodySectionComponent, { static: false })
  visualizationBody: VisualizationBodySectionComponent;

  @Output() toggleFullScreen: EventEmitter<any> = new EventEmitter<any>();

  @Output() deleteVisualization: EventEmitter<any> = new EventEmitter<any>();

  private _visualizationInputs$: Subject<VisualizationInputs> = new Subject();
  visualizationObject$: Observable<Visualization>;
  visualizationLayers$: Observable<VisualizationLayer[]>;
  visualizationUiConfig$: Observable<VisualizationUiConfig>;
  visualizationProgress$: Observable<VisualizationProgress>;
  visualizationConfig$: Observable<VisualizationConfig>;
  focusedVisualization$: Observable<string>;
  legendDefinitions: Legend[];

  constructor(private store: Store<VisualizationState>) {
    this.cardFocused = false;
    this.type = 'REPORT_TABLE';
    this._visualizationInputs$
      .asObservable()
      .subscribe((visualizationInputs) => {
        if (visualizationInputs) {
          // initialize visualization object
          this.store.dispatch(
            new InitializeVisualizationObjectAction(
              visualizationInputs.id,
              visualizationInputs.name,
              visualizationInputs.type,
              visualizationInputs.visualizationLayers,
              visualizationInputs.currentUser,
              visualizationInputs.systemInfo,
              visualizationInputs.interventionArchive
            )
          );

          // Get selectors
          this.visualizationObject$ = this.store.select(
            getVisualizationObjectById(visualizationInputs.id)
          );
          this.visualizationLayers$ = this.store.select(
            getCurrentVisualizationObjectLayers(visualizationInputs.id)
          );
          this.visualizationUiConfig$ = this.store.select(
            getCurrentVisualizationUiConfig(visualizationInputs.id)
          );
          this.visualizationProgress$ = this.store.select(
            getCurrentVisualizationProgress(visualizationInputs.id)
          );
          this.visualizationConfig$ = this.store.select(
            getCurrentVisualizationConfig(visualizationInputs.id)
          );

          this.focusedVisualization$ = store.select(getFocusedVisualization);
        }
      });
  }

  ngOnChanges() {
    this._visualizationInputs$.next({
      id: this.id,
      type: this.type,
      visualizationLayers: this.visualizationLayers,
      name: this.name,
      currentUser: this.currentUser,
      systemInfo: this.systemInfo,
      interventionArchive: this.currentInterventionArchive,
    });
  }

  ngOnInit() {
    this.legendDefinitions = getLegendDefinitionsFromSelections(
      this.dashboard ? this.dashboard.globalSelections : []
    );
  }

  onToggleVisualizationBody(uiConfig) {
    this.store.dispatch(
      new ShowOrHideVisualizationBodyAction(uiConfig.id, {
        showBody: uiConfig.showBody,
      })
    );
  }

  onVisualizationTypeChange(visualizationTypeObject) {
    this.store.dispatch(
      new UpdateVisualizationConfigurationAction(visualizationTypeObject.id, {
        currentType: visualizationTypeObject.type,
      })
    );
  }

  onFullScreenAction(event: {
    id: string;
    uiConfigId: string;
    fullScreen: boolean;
  }) {
    this.toggleFullScreen.emit({
      id: this.id,
      dashboardId: this.dashboard.id,
      fullScreen: event.fullScreen,
    });
    this.store.dispatch(new ToggleFullScreenAction(event.uiConfigId));
  }

  onLoadVisualizationAnalytics(visualizationLayer: VisualizationLayer) {
    this.store.dispatch(
      new LoadVisualizationAnalyticsAction(this.id, [visualizationLayer])
    );
  }

  onVisualizationLayerConfigUpdate(visualizationLayer: VisualizationLayer) {
    this.store.dispatch(
      new UpdateVisualizationLayerAction(visualizationLayer.id, {
        config: visualizationLayer.config,
        dataSelections: visualizationLayer.dataSelections,
      })
    );
  }

  onSaveFavorite(favoriteDetails) {
    this.store.dispatch(
      new SaveVisualizationFavoriteAction(
        this.id,
        favoriteDetails,
        this.dashboard.id
      )
    );
  }

  onToggleVisualizationCardFocus(e, focused: boolean) {
    e.stopPropagation();
    if (this.cardFocused !== focused) {
      this.visualizationUiConfig$
        .pipe(take(1))
        .subscribe((visualizationUiConfig: VisualizationUiConfig) => {
          this.store.dispatch(
            new ToggleVisualizationFocusAction(visualizationUiConfig.id, {
              hideFooter: !focused,
              hideResizeButtons: !focused,
            })
          );
          this.cardFocused = focused;
        });
    }
  }

  onDeleteVisualizationAction(options: any) {
    this.visualizationObject$
      .pipe(take(1))
      .subscribe((visualization: Visualization) => {
        this.deleteVisualization.emit({
          visualization,
          deleteFavorite: options.deleteFavorite,
        });

        this.store.dispatch(
          new UpdateVisualizationObjectAction(this.id, {
            notification: {
              message: 'Removing dasboard item...',
              type: 'progress',
            },
          })
        );
      });
  }

  onVisualizationDownload(downloadDetails: any) {
    if (this.visualizationBody) {
      this.visualizationBody.onDownloadVisualization(
        downloadDetails.type,
        downloadDetails.downloadFormat
      );
    }
  }

  onVisualizationLayoutChange() {
    this.visualizationLayers$
      .pipe(take(1))
      .subscribe((visualizationLayers: VisualizationLayer[]) => {
        // TODO: FIND BEST WAY TO UPDATE VISUALIZATION LAYERS AFTER LAYOUT CHANGE
        const visualizationBasedOnLayoutChange = updateVisualizationLayerBasedOnLayoutChange(
          visualizationLayers
        );

        if (this.visualizationBody) {
          this.visualizationBody.onVisualizationLayoutChange(
            visualizationBasedOnLayoutChange
          );
        }
        _.each(visualizationBasedOnLayoutChange, (visualizationLayer) => {
          this.store.dispatch(
            new UpdateVisualizationLayerAction(visualizationLayer.id, {
              dataSelections: [...visualizationLayer.dataSelections],
            })
          );
        });
      });
  }
}
