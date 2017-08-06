import {
   Component, EventEmitter, Input, OnInit, Output,
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
  ResizeDashboardAction, SaveFavoriteAction, UpdateVisualizationWithCustomFilterAction
} from '../../../store/actions';
import {ChartComponent} from '../chart/chart.component';
import {Observable} from 'rxjs/Observable';
import {
  DASHBOARD_BLOCK_CLASSES, DASHBOARD_SHAPES, NO_BORDER_CLASS,
  VISUALIZATION_WITH_NO_OPTIONS
} from '../../constants/visualization';


@Component({
  selector: 'app-dashboard-item-card',
  templateUrl: './dashboard-item-card.component.html',
  styleUrls: ['./dashboard-item-card.component.css'],
})
export class DashboardItemCardComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  @Input() globalFilters: Observable<any>;
  @Output() onFilterDeactivate: EventEmitter<any> = new EventEmitter<any>();
  private _dashboardCardClasses: any[];
  private _dashboardBlockClasses: any[];
  private _dashboardBlockHeight: string;
  private _showFilter: any;
  showPeriodFilter: boolean;
  showOrgUnitFilter: boolean;
  showDataFilter: boolean;
  showLayout: boolean;
  visualizationWithNoOptions: any[] = VISUALIZATION_WITH_NO_OPTIONS;
  private _currentVisualizationType: string;
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
  showFavoriteSettings: boolean = false;
  currentShape: string;
  metadataIdentifiers: string;
  constructor(private store: Store<ApplicationState>) {
    this._showFilter = {
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
        enabled: false,
        shown: false
      }
    };
  }


  get showFilter(): any {
    return this._showFilter;
  }

  set showFilter(value: any) {
    this._showFilter = value;
  }

  get dashboardBlockHeight(): string {
    return this._dashboardBlockHeight;
  }

  set dashboardBlockHeight(value: string) {
    this._dashboardBlockHeight = value;
  }

  get dashboardBlockClasses(): any[] {
    return this._dashboardBlockClasses;
  }

  set dashboardBlockClasses(value: any[]) {
    this._dashboardBlockClasses = value;
  }

  get currentVisualizationType(): string {
    return this._currentVisualizationType;
  }

  set currentVisualizationType(value: string) {
    this._currentVisualizationType = value;
  }

  get dashboardCardClasses(): any[] {
    return this._dashboardCardClasses;
  }

  set dashboardCardClasses(value: any[]) {
    this._dashboardCardClasses = value;
  }

  ngOnInit() {
    /**
     * Set initial visualization type
     * @type {string}
     */
    this._currentVisualizationType = this.visualizationObject.details.currentVisualization;

    /**
     * Set initial visualization Card classes
     * @type {string}
     */
    this._dashboardCardClasses = this._getDashboardCardClasses(
      this.visualizationObject.shape,
      DASHBOARD_SHAPES,
      this.visualizationObject.details.showFullScreen
    );

    /**
     * Set dashboard block classes
     * @type {any[]}
     * @private
     */
    this._dashboardBlockClasses = this._getDashboardBlockClasses(
      DASHBOARD_BLOCK_CLASSES,
      NO_BORDER_CLASS,
      this.visualizationObject.details.hideCardBorders
    );

    /**
     * Get dashboard block height
     * @type {string}
     * @private
     */
    this._dashboardBlockHeight = this.visualizationObject.details.cardHeight;

    /**
     * Get global filters
     */
    this.globalFilters.subscribe(filters => {
      if (filters != null) {
        this.updateFilters(filters);
        this.onFilterDeactivate.emit(null);
      }
    });
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

  getMouseAction(event) {
    /**
     * Footer actions
     */
    const visualizationType = this._currentVisualizationType;
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

  resizeDashboard(): void {
    let newShape = 'NORMAL';
    const visualizationObject: Visualization = _.clone(this.visualizationObject);
    const currentShape: string = this.visualizationObject.shape;
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

    this.visualizationObject = visualizationObject;

    this.resizeChildren(newShape);

    this.store.select(apiRootUrlSelector).subscribe(apiRootUrl => {
      if (apiRootUrl !== '') {
        this.store.dispatch(new ResizeDashboardAction(
          {
            apiRootUrl: apiRootUrl,
            id: visualizationObject.id,
            dashboardId: visualizationObject.dashboardId,
            shape: newShape
          }
          )
        );
      }
    });
  }

  resizeChildren(shape?) {
    if (this.chartComponent) {
      this.chartComponent.resize(shape);
    }
  }

  toggleFullScreen(): void {
    /**
     * Change card height when toggling full screen to enable items to stretch accordingly
     */
    const visualizationObject = _.cloneDeep(this.visualizationObject);
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

    this.resizeChildren();
  }

  updateVisualization(selectedVisualization) {
    if (this._currentVisualizationType !== selectedVisualization) {
      this._currentVisualizationType = selectedVisualization;

      if (selectedVisualization === 'DICTIONARY') {
        this.metadataIdentifiers = this.getMetadataIdentifier(this.visualizationObject);
      } else {
        const visualizationObject = _.clone(this.visualizationObject);
        this.store.dispatch(new CurrentVisualizationChangeAction({
          selectedVisualization: selectedVisualization,
          visualizationObject: visualizationObject
        }))
      }
    }
  }

  updateFilters(filterValue) {
    console.log(filterValue);
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

  downloadVisualization(downloadFormat) {
    if (downloadFormat === 'excel') {
      console.log('download excel')
    } else {
      if (this.chartComponent) {
        this.chartComponent.download(downloadFormat);
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

  toggleFilter() {
    this._showFilter.orgUnit.shown = !this._showFilter.orgUnit.shown;
    this._showFilter.data.shown = !this._showFilter.data.shown;
    this._showFilter.period.shown = !this._showFilter.period.shown;
    this._showFilter.settings.shown = !this._showFilter.settings.shown;
  }

  updateLayout(layoutOptions) {
    const layoutOptionsArray = this.visualizationObject.details.layouts;

    if (layoutOptionsArray) {
      layoutOptionsArray.forEach(layoutOptions => {
        console.log(layoutOptions)
      })
    }
    console.log(layoutOptions, this.visualizationObject.details.layouts)
  }

}
