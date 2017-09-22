import {
  ChangeDetectionStrategy,
  Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {Visualization} from '../../model/visualization';
import * as _ from 'lodash';
import {ApplicationState} from '../../../store/application-state';
import {Store} from '@ngrx/store';
import {apiRootUrlSelector} from '../../../store/selectors/api-root-url.selector';
import {
  CurrentVisualizationChangeAction, DeleteVisualizationObjectAction,
  FullScreenToggleAction,
  ResizeDashboardAction, SaveFavoriteAction, SaveVisualization, UpdateVisualizationWithCustomFilterAction,
  VisualizationObjectLayoutChangeAction
} from '../../../store/actions';
import * as fromAction from '../../../store/actions';
import {ChartComponent} from '../chart/chart.component';
import {Observable} from 'rxjs/Observable';
import {
  DASHBOARD_BLOCK_CLASSES, DASHBOARD_SHAPES, NO_BORDER_CLASS,
  VISUALIZATION_WITH_NO_OPTIONS
} from '../../constants/visualization';
import {MapComponent} from "../map/map.component";
import {interpretationLinkSelector} from '../../../store/selectors/interpretation-link.selector';
import {VisualizationObjectService} from '../../providers/visualization-object.service';


@Component({
  selector: 'app-dashboard-item-card',
  templateUrl: './dashboard-item-card.component.html',
  styleUrls: ['./dashboard-item-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardItemCardComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  @Input() globalFilters: Observable<any>;
  @Output() onFilterDeactivate: EventEmitter<any> = new EventEmitter<any>();
  dashboardCardClasses: any[];
  dashboardBlockClasses: any[];
  dashboardBlockHeight: string;
  showFilter: any;
  layoutModel: any;
  selectedDataItems: any;
  selectedPeriods: any;
  selectedOrgUnits: any;
  showPeriodFilter: boolean;
  showOrgUnitFilter: boolean;
  showDataFilter: boolean;
  showLayout: boolean;
  visualizationWithNoOptions: any[] = VISUALIZATION_WITH_NO_OPTIONS;
  currentVisualizationType: string;
  interpretations: any[];
  cardConfiguration: any = {
    showCardHeader: false,
    showCardFooter: false,
    showDeleteButton: true,
    confirmDelete: false,
    defaultHeight: '470px',
    defaultItemHeight: '438px',
    fullScreenItemHeight: '93vh',
    fullScreenHeight: '97vh',
    fullScreen: false,
    showOptions: true,
    showFilter: false,
    optionsVisibility: 'hidden',
    blockWidth: '100%',
    showMailButton: true,
    showResizeButton: false,
    showFullScreen: false,
    showDownloadOptions: false,
    allowMultipleSwitchingIcons: true
  };
  @ViewChild(ChartComponent)
  chartComponent: ChartComponent;
  @ViewChild(MapComponent)
  mapComponent: MapComponent;
  showFavoriteSettings: boolean = false;
  metadataIdentifiers: string;
  interpretationLink$: Observable<string>;
  needUpdate: boolean;
  localVisualizationObject: Visualization = null;
  constructor(
    private store: Store<ApplicationState>,
    private visualizationObjectService: VisualizationObjectService
  ) {
    this.showFilter = {
      orgUnit: {
        enabled: true,
        shown: false
      },
      data:  {
        enabled: true,
        shown: false
      },

      period:  {
        enabled: true,
        shown: false
      },
      settings: {
        enabled: true,
        shown: false
      }
    };
    this.selectedDataItems = [];

    this.interpretations = [];
    this.interpretationLink$ = store.select(interpretationLinkSelector);
    this.needUpdate = true;
  }

  ngOnInit() {
    if (this.visualizationObject.details.loaded && this.needUpdate) {
      this.localVisualizationObject = {...this.visualizationObject};
      this.needUpdate = false;
    }

    /**
     * Set initial visualization type
     * @type {string}
     */
    this.currentVisualizationType = this.visualizationObject.details.currentVisualization;

    /**
     * Set initial visualization Card classes
     * @type {string}
     */
    this.dashboardCardClasses = this._getDashboardCardClasses(
      this.visualizationObject.shape,
      DASHBOARD_SHAPES,
      this.visualizationObject.details.showFullScreen
    );

    /**
     * Set dashboard block classes
     * @type {any[]}
     * @private
     */
    this.dashboardBlockClasses = this._getDashboardBlockClasses(
      DASHBOARD_BLOCK_CLASSES,
      NO_BORDER_CLASS,
      this.visualizationObject.details.hideCardBorders
    );

    /**
     * Get dashboard block height
     * @type {string}
     * @private
     */
    this.dashboardBlockHeight = this.visualizationObject.details.cardHeight;

    /**
     * Set initial layout model
     */
    if (this.visualizationObject.details.layouts.length > 0) {
      this.layoutModel = this.visualizationObject.details.layouts[0].layout;
    }

    /**
     * Get global filters
     */
    this.globalFilters.subscribe(filters => {
      if (filters != null) {
        this.updateFilters(filters);
        this.onFilterDeactivate.emit(null);
      }
    });

    /**
     * Get selected data items
     */
    this.selectedDataItems = _.assign([], this.getSelectedItems(this.visualizationObject.details.filters, 'dx'));

    /**
     * Get selected periods
     */
    this.selectedPeriods = _.assign([], this.getSelectedItems(this.visualizationObject.details.filters, 'pe'));

    /**
     * Get selected Organisation unit
     */
    // console.log(this._getSelectedOrganUnitModel(this.getSelectedItems(this.visualizationObject.details.filters, 'ou')))

    if (this.visualizationObject.details.interpretations) {
      this.interpretations = this.visualizationObject.details.interpretations[0].interpretations
    }

  }

  private _getDashboardCardClasses(currentShape, shapes: any[] = [], showFullScreen: boolean = false): any[] {
    let shapeClasses: any[] = ['col-md-4', 'col-sm-6', 'col-xs-12'];
    if (!showFullScreen) {
      if (shapes !== undefined && shapes.length > 1) {
        for (const shapeValue of shapes) {
          if (shapeValue.hasOwnProperty('shape') && shapeValue.shape === currentShape) {
            if (shapeValue.hasOwnProperty('shapeClasses')) {
              shapeClasses = shapeValue.shapeClasses;
            }
          }
        }
      }
    } else {
      shapeClasses = ['dashboard-card', 'full-screen'];
    }
    return shapeClasses;
  }

  private _getDashboardBlockClasses(dashboardsBlockClasses: any[], noBorderClass: string, hideBorders: boolean = false) {
    const newDashboardBlockClasses = dashboardsBlockClasses;
    if (hideBorders) {
      newDashboardBlockClasses.push(noBorderClass)
    }
    return newDashboardBlockClasses;
  }

  getMouseAction(event, e) {
    e.stopPropagation();
    /**
     * Footer actions
     */
    const visualizationType = this.currentVisualizationType;
    if (!this.hideOptions(visualizationType, this.visualizationWithNoOptions)) {
      this.cardConfiguration.showCardFooter = !this.cardConfiguration.showCardFooter;
      this.cardConfiguration.showCardHeader = !this.cardConfiguration.showCardHeader;
    }

    /**
     * Pass the action to children
     */
    if (visualizationType === 'CHART') {
      if (this.chartComponent) {
        this.chartComponent.toggleOptions(event)
      }
    }

  }

  hideOptions(visualizationType: string, visualizationWithNoOptions: any[] = []): boolean {
    let hide = false;

    if (visualizationWithNoOptions) {
      if (visualizationWithNoOptions.indexOf(visualizationType) !== -1) {
        hide = true;
      }
    }
    return hide;
  }

  resizeDashboard(e): void {
    e.stopPropagation();
    let newShape = 'NORMAL';
    const visualizationObject: Visualization = {...this.visualizationObject};
    const currentShape: string = visualizationObject.shape;
    const shapes: any[] = DASHBOARD_SHAPES;

    /**
     * Compute new shape
     */
    if (shapes !== undefined && shapes.length > 1) {
      shapes.forEach((shapeValue, shapeIndex) => {
        if (shapeValue.hasOwnProperty('shape') && shapeValue.shape === currentShape) {
          if (shapeIndex + 1 < shapes.length) {
            newShape = shapes[shapeIndex + 1].shape
          }
        }
      });
    }
    visualizationObject.shape = newShape;

    this.store.dispatch(new ResizeDashboardAction({
        id: visualizationObject.id,
        visualizationObject: visualizationObject,
        dashboardId: visualizationObject.dashboardId,
        shape: newShape
      })
    )
  }

  resizeChildren(shape, fullScreen, height) {
    if (this.chartComponent) {
      this.chartComponent.resize(shape, fullScreen, height);
    }
  }

  toggleFullScreen(event): void {
    event.stopPropagation();
    /**
     * Change card height when toggling full screen to enable items to stretch accordingly
     */
    const visualizationObject = {...this.localVisualizationObject};
    if (visualizationObject.details.showFullScreen) {
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
      visualizationObject.details.cardHeight = '490px';
      visualizationObject.details.itemHeight = '465px';
    } else {
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
      visualizationObject.details.cardHeight = '97vh';
      visualizationObject.details.itemHeight = '93vh';
    }

    visualizationObject.details.showFullScreen = !visualizationObject.details.showFullScreen;

    this.store.dispatch(new FullScreenToggleAction(visualizationObject));
  }

  updateVisualization(selectedVisualization) {
    if (this.currentVisualizationType !== selectedVisualization) {
      let visualization: Visualization = {...this.visualizationObject};
      visualization.layers = visualization.operatingLayers;

      if (selectedVisualization === 'DICTIONARY') {
        this.metadataIdentifiers = this.getMetadataIdentifier(this.visualizationObject);
      }

      if (selectedVisualization === 'MAP' && visualization.details.type !== 'MAP') {
        visualization = this.visualizationObjectService.splitVisualizationObject(visualization);
        this.store.select(apiRootUrlSelector)
          .subscribe((apiRootUrl) => {
            this.visualizationObjectService.updateVisualizationWithMapSettings(apiRootUrl, visualization)
              .subscribe((visualizationWithMapSettings: Visualization) => {
                this.store.dispatch(new fromAction.SaveVisualization(visualizationWithMapSettings))
              })
          });
      } else if (selectedVisualization !== 'MAP' && this.visualizationObject.type === 'MAP') {
        visualization = this.visualizationObjectService.mergeVisualizationObject(visualization);
        this.store.dispatch(new fromAction.SaveVisualization(visualization));
      } else {
        this.store.dispatch(new fromAction.SaveVisualization(visualization));
      }

      visualization.details.currentVisualization = selectedVisualization;
      this.currentVisualizationType = selectedVisualization;
    }
  }

  updateFilters(filterValue) {
    const newFilterValue = filterValue.selectedData ? filterValue.selectedData : filterValue;
    const newFilterItems = filterValue.items ? filterValue.items : filterValue.itemList;
    const filterArray = this.visualizationObject.details.filters;
    const newVisualizationObject = _.clone(this.visualizationObject);
    if (filterArray) {
      filterArray.forEach(filterObject => {
        filterObject.filters.forEach(filter => {
          if (newFilterValue.name === filter.name) {
            filter.value = newFilterValue.value;
            filter.items = this._mapFilterItemsToFavoriteFormat(newFilterItems, filter.name);
          }
        })
      })
    }
    this.updateVisualizationWithOptionsOrFilterUpdate(newVisualizationObject, filterArray, true)
  }

  private _mapFilterItemsToFavoriteFormat(filterItems, dimensionType) {
    const newFilterItems: any = [];

    filterItems.forEach(filterItem => {
      if (dimensionType === 'pe') {
        newFilterItems.push({
          id: filterItem.id,
          dimensionItem: filterItem.id,
          displayName: filterItem.name,
          dimensionItemType: 'PERIOD'
        })
      } else if (dimensionType === 'ou') {
        newFilterItems.push({
          id: filterItem.id,
          dimensionItem: filterItem.id,
          displayName: filterItem.name,
          dimensionItemType: 'ORGANISATION_UNIT'
        })
      } else if (dimensionType === 'dx') {
        newFilterItems.push({
          id: filterItem.id,
          dimensionItem: filterItem.id,
          displayName: filterItem.name,
          dimensionItemType: filterItem.dataElementId ? 'DATA_ELEMENT' : 'INDICATOR'
        })
      }
    });

    return newFilterItems;
  }

  updateVisualizationWithOptionsOrFilterUpdate(visualizationObject, filterArray, updateAvailable?) {
    this.store.dispatch(new UpdateVisualizationWithCustomFilterAction({
        visualizationObject: visualizationObject,
        filters: filterArray,
        updateAvailable: updateAvailable ? true : false
      }))
  }

  saveSettings() {
    const visualizationObject = _.clone(this.visualizationObject);
    this.store.select(apiRootUrlSelector).subscribe(apiRootUrl => {
      if (apiRootUrl !== '') {
        this.store.dispatch( new SaveFavoriteAction({
          apiRootUrl: apiRootUrl,
          visualizationObject: visualizationObject
        }))
      }
    })
  }



  toggleFavoriteSettings() {
    this.showFavoriteSettings = !this.showFavoriteSettings;
  }

  getVisualizationSettings(visualizationLayers) {
    return visualizationLayers.map(layer => {return layer.settings});
  }

  updateVisualizationSettings(visualizationSettings) {
    const newVisualizationObject = _.clone(this.visualizationObject);
    if (visualizationSettings) {
      newVisualizationObject.layers.forEach((layer: any) => {
        const newSetting = _.find(visualizationSettings, ['id', layer.settings.id]);
        if (newSetting) {
          layer.settings = newSetting;
        }
      })
    }
    const filterArray = this.visualizationObject.details.filters;
    this.updateVisualizationWithOptionsOrFilterUpdate(newVisualizationObject, filterArray, true)
  }

  getMetadataIdentifier(visualizationObject) {
    const visualizationFilters = visualizationObject.details.filters;
    let metadataIdentifiers: string = '';
    if (visualizationFilters) {
      const metadataArray = visualizationFilters.map(filterObject => {
        const metadata = _.find(filterObject.filters, ['name', 'dx']);
        return metadata ? metadata.value : '';
      });
      metadataIdentifiers = metadataArray.join(';');
    }

    return metadataIdentifiers;
  }

  downloadVisualization(downloadFormat,currentVisualizationType) {

    if (currentVisualizationType == "MAP")
    {
      this.mapComponent.downLoadFiles(downloadFormat);
    } else
    {
      if (downloadFormat === 'excel') {
        console.log('download excel')
      } else {
        if (this.chartComponent) {
          this.chartComponent.download(downloadFormat);
        }
      }
    }

  }

  deleteVisualizationObject(visualizationObject) {
    this.cardConfiguration.confirmDelete = false;
    this.store.select(apiRootUrlSelector).subscribe(apiRootUrl => {
      if (apiRootUrl !== '') {
        this.store.dispatch(new DeleteVisualizationObjectAction({
          apiRootUrl: apiRootUrl,
          dashboardId: visualizationObject.dashboardId,
          visualizationObjectId: visualizationObject.id
        }))
      }
    })

  }

  toggleFilter(e) {
    e.stopPropagation();
    this.showFilter.orgUnit.shown = !this.showFilter.orgUnit.shown;
    this.showFilter.data.shown = !this.showFilter.data.shown;
    this.showFilter.period.shown = !this.showFilter.period.shown;
    this.showFilter.settings.shown = !this.showFilter.settings.shown;
  }

  updateLayout(layoutOptions) {
    const layoutOptionsArray = _.clone(this.visualizationObject.details.layouts);

    if (layoutOptionsArray) {
      const newLayoutArray = _.map(layoutOptionsArray, (layoutObject) => {
        const newLayoutObject = _.clone(layoutObject);
        newLayoutObject.layout = _.assign({}, layoutOptions);
        return newLayoutObject;
      });

      this.store.dispatch(new VisualizationObjectLayoutChangeAction({
        layouts: newLayoutArray,
        visualizationObject: this.visualizationObject
      }))
    }
  }

  getSelectedItems(filters: any[], dimension: string) {
    // todo take data items based on the current layer
    if (filters && filters[0]) {
      const dataItemObject = _.find(filters[0].filters, ['name', dimension]);

      if (dataItemObject) {
        return _.map(dataItemObject.items, (dataItem: any) => {
          return {
            id: dataItem.dimensionItem,
            name: dataItem.displayName,
          }
        })
      }
    }
    return []
  }

  private _getSelectedOrganUnitModel(orgUnitArray) {
    return orgUnitArray;
  }

  updateVisualizationWithChartType(chartType: string) {
    const visualization: Visualization = {...this.visualizationObject};

    visualization.layers = _.map(visualization.layers, (layer: any) => {
      const newLayer = _.clone(layer);
      newLayer.settings.type = chartType;
      return newLayer;
    });

    visualization.operatingLayers = _.map(visualization.layers, (layer: any) => {
      const newLayer = _.clone(layer);
      newLayer.settings.type = chartType;
      return newLayer;
    });

    this.store.dispatch(new fromAction.SaveVisualization(visualization));

  }
}
