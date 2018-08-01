import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit
} from '@angular/core';
import { VisualizationLayer } from '../../models/visualization-layer.model';
import { VisualizationInputs } from '../../models/visualization-inputs.model';
import { Observable, Subject, forkJoin, pipe } from 'rxjs';
import { Visualization } from '../../models/visualization.model';
import { VisualizationUiConfig } from '../../models/visualization-ui-config.model';
import { VisualizationProgress } from '../../models/visualization-progress.model';
import { VisualizationConfig } from '../../models/visualization-config.model';
import { VisualizationState } from '../../store/reducers';
import { Store } from '@ngrx/store';
import {
  InitializeVisualizationObjectAction,
  UpdateVisualizationObjectAction,
  SaveVisualizationFavoriteAction
} from '../../store/actions/visualization-object.actions';
import {
  getCurrentVisualizationProgress,
  getVisualizationObjectById
} from '../../store/selectors/visualization-object.selectors';
import { getCurrentVisualizationObjectLayers } from '../../store/selectors/visualization-layer.selectors';
import { getCurrentVisualizationUiConfig } from '../../store/selectors/visualization-ui-configuration.selectors';
import { getCurrentVisualizationConfig } from '../../store/selectors/visualization-configuration.selectors';
import {
  ShowOrHideVisualizationBodyAction,
  ToggleFullScreenAction
} from '../../store/actions/visualization-ui-configuration.actions';
import { UpdateVisualizationConfigurationAction } from '../../store/actions/visualization-configuration.actions';
import { LoadVisualizationAnalyticsAction } from '../../store/actions/visualization-layer.actions';
import { take, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'ngx-dhis2-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisualizationComponent implements OnInit, OnChanges {
  @Input() id: string;
  @Input() index: number;
  @Input() type: string;
  @Input() visualizationLayers: VisualizationLayer[];
  @Input() name: string;
  @Input() isNewFavorite: boolean;
  @Input() dashboardId: string;

  private _visualizationInputs$: Subject<VisualizationInputs> = new Subject();
  visualizationObject$: Observable<Visualization>;
  visualizationLayers$: Observable<VisualizationLayer[]>;
  visualizationUiConfig$: Observable<VisualizationUiConfig>;
  visualizationProgress$: Observable<VisualizationProgress>;
  visualizationConfig$: Observable<VisualizationConfig>;

  constructor(private store: Store<VisualizationState>) {
    this.type = 'TABLE';
    this._visualizationInputs$.asObservable().subscribe(visualizationInputs => {
      if (visualizationInputs) {
        // initialize visualization object
        this.store.dispatch(
          new InitializeVisualizationObjectAction(
            visualizationInputs.id,
            visualizationInputs.name,
            visualizationInputs.type,
            visualizationInputs.visualizationLayers,
            visualizationInputs.index
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
      }
    });
  }

  ngOnChanges() {
    this._visualizationInputs$.next({
      id: this.id,
      type: this.type,
      visualizationLayers: this.visualizationLayers,
      name: this.name,
      index: this.index
    });
  }

  ngOnInit() {}

  onToggleVisualizationBody(uiConfig) {
    this.store.dispatch(
      new ShowOrHideVisualizationBodyAction(uiConfig.id, {
        showBody: uiConfig.showBody
      })
    );
  }

  onVisualizationTypeChange(visualizationTypeObject) {
    this.store.dispatch(
      new UpdateVisualizationConfigurationAction(visualizationTypeObject.id, {
        currentType: visualizationTypeObject.type
      })
    );
  }

  onFullScreenAction(event: { id: string; uiConfigId: string }) {
    this.store.dispatch(new ToggleFullScreenAction(event.uiConfigId));
  }

  onVisualizationLayerUpdate(visualizationLayer: VisualizationLayer) {
    this.store.dispatch(
      new UpdateVisualizationObjectAction(this.id, {
        progress: {
          statusCode: 200,
          statusText: 'OK',
          percent: 50,
          message: 'Favorite information has been loaded'
        }
      })
    );

    this.store.dispatch(
      new LoadVisualizationAnalyticsAction(this.id, [visualizationLayer])
    );
  }

  onSaveFavorite(favoriteDetails) {
    this.visualizationConfig$
      .pipe(
        switchMap((config: any) =>
          this.visualizationLayers$.pipe(
            map((layers: any[]) => {
              return { config, layers };
            })
          )
        ),
        take(1)
      )
      .subscribe((visualizationDetails: any) => {
        this.store.dispatch(
          new SaveVisualizationFavoriteAction(
            this.id,
            favoriteDetails.name,
            favoriteDetails.isNew,
            visualizationDetails.config,
            visualizationDetails.layers,
            this.dashboardId
          )
        );
      });
  }
}
