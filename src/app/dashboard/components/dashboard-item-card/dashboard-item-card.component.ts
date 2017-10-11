import {
  ChangeDetectionStrategy,
  Component, EventEmitter, Input, OnInit, Output,
  ViewChild
} from '@angular/core';
import {Visualization} from '../../model/visualization';
import * as _ from 'lodash';
import {ApplicationState} from '../../../store/application-state';
import {Store} from '@ngrx/store';
import {apiRootUrlSelector} from '../../../store/selectors/api-root-url.selector';
import * as fromAction from '../../../store/actions';
import {ChartComponent} from '../chart/chart.component';
import {Observable} from 'rxjs/Observable';
import {
  DASHBOARD_BLOCK_CLASSES, DASHBOARD_SHAPES, NO_BORDER_CLASS,
  VISUALIZATION_WITH_NO_OPTIONS
} from '../../constants/visualization';
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
  orgUnitModel: any = {
    selection_mode: 'orgUnit',
    selected_levels: [],
    show_update_button: true,
    selected_groups: [],
    orgunit_levels: [],
    orgunit_groups: [],
    selected_orgunits: [],
    user_orgunits: [],
    type: 'report', // can be 'data_entry'
    selected_user_orgunit: []
  };
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
    enableDeleteButton: true,
    showDeleteButton: false,
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
  // @ViewChild(MapComponent)
  // mapComponent: MapComponent;
  showFavoriteSettings: boolean = false;
  metadataIdentifiers: string;
  interpretationLink$: Observable<string>;
  needUpdate: boolean;
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

    if (this.visualizationObject.details.filters.length > 0) {
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
      this.orgUnitModel = this._getSelectedOrganUnitModel(this.getSelectedItems(this.visualizationObject.details.filters, 'ou'));
    }


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
    this.cardConfiguration.showDeleteButton = !this.cardConfiguration.showDeleteButton;
    if (!this.hideOptions(this.currentVisualizationType, this.visualizationWithNoOptions)) {
      this.cardConfiguration.showCardFooter = !this.cardConfiguration.showCardFooter;
      this.cardConfiguration.showCardHeader = !this.cardConfiguration.showCardHeader;
    }

    /**
     * Pass the action to children
     */
    if (this.currentVisualizationType === 'CHART') {
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

    this.store.dispatch(new fromAction.ResizeDashboardAction({
        id: visualizationObject.id,
        visualizationObject: visualizationObject,
        dashboardId: visualizationObject.dashboardId,
        shape: newShape
      })
    )
  }

  toggleFullScreen(event): void {
    event.stopPropagation();
    /**
     * Change card height when toggling full screen to enable items to stretch accordingly
     */
    const visualizationObject: Visualization = {...this.visualizationObject};
    const visualizationDetails: any = {...this.visualizationObject.details};
    if (visualizationDetails.showFullScreen) {
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
      visualizationDetails.cardHeight = '490px';
      visualizationDetails.itemHeight = '465px';
    } else {
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
      visualizationDetails.cardHeight = '97vh';
      visualizationDetails.itemHeight = '93vh';
    }

    visualizationDetails.showFullScreen = !visualizationDetails.showFullScreen;

    visualizationObject.details = {...visualizationDetails};
    this.store.dispatch(new fromAction.FullScreenToggleAction(visualizationObject));
  }

  updateVisualization(selectedVisualization) {
    if (this.currentVisualizationType !== selectedVisualization) {
      let visualization: Visualization = {...this.visualizationObject};
      visualization.layers = visualization.operatingLayers;

      if (selectedVisualization === 'DICTIONARY') {
        this.metadataIdentifiers = this.getMetadataIdentifier(this.visualizationObject);
      }

      if (selectedVisualization === 'MAP' && visualization.details.type !== 'MAP') {
        visualization.details.loaded = false;
        this.store.dispatch(new fromAction.SaveVisualization(visualization));
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
    this.showDataFilter = false;
    this.showPeriodFilter = false;
    this.showOrgUnitFilter = false;
    this.store.dispatch(new fromAction.LocalFilterChangeAction({visualizationObject: this.visualizationObject, filterValue: filterValue}));
  }

  updateVisualizationWithOptionsOrFilterUpdate(visualizationObject, filterArray, updateAvailable?) {
    this.store.dispatch(new fromAction.UpdateVisualizationWithCustomFilterAction({
        visualizationObject: visualizationObject,
        filters: filterArray,
        updateAvailable: updateAvailable ? true : false
      }))
  }

  saveSettings() {
    const visualizationObject = _.clone(this.visualizationObject);
    this.store.select(apiRootUrlSelector).subscribe(apiRootUrl => {
      if (apiRootUrl !== '') {
        this.store.dispatch( new fromAction.SaveFavoriteAction({
          apiRootUrl: apiRootUrl,
          visualizationObject: visualizationObject
        }))
      }
    })
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
      // this.mapComponent.downLoadFiles(downloadFormat);
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
        this.store.dispatch(new fromAction.DeleteVisualizationObjectAction({
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

  updateLayout(layoutOptions: any) {

    const newVisualizationObject: Visualization = {...this.visualizationObject};

    newVisualizationObject.details.layouts = _.map(newVisualizationObject.details.layouts, (layoutObject: any) => {
      layoutObject.layout = {...layoutOptions};
      return layoutObject;
    });

    this.store.dispatch(new fromAction.SaveVisualization(newVisualizationObject));
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
            type: dataItem.dimensionItemType
          }
        })
      }
    }
    return []
  }

  private _getSelectedOrganUnitModel(orgUnitArray) {
    const selectedOrgUnitLevels = orgUnitArray.filter((orgunit) => orgunit.id.indexOf('LEVEL') !== -1);
    const selectedUserOrgUnit = orgUnitArray.filter((orgunit) => orgunit.id.indexOf('USER') != -1);
    const selectedOrgUnitGroups = orgUnitArray.filter((orgunit) => orgunit.id.indexOf('OU_GROUP') !== -1);

    const selectionMode = selectedOrgUnitLevels.length > 0 ? 'Level' : selectedOrgUnitGroups.length > 0 ? 'Group' : 'orgUnit';
    const orgUnitModel = {
      selection_mode: selectionMode,
      selected_levels: selectedOrgUnitLevels.map((orgunitlevel) => {
        return {
          level: orgunitlevel.id.split('-')[1]
        }
      }),
      show_update_button: true,
      selected_groups: selectedOrgUnitGroups,
      orgunit_levels: [],
      orgunit_groups: [],
      selected_orgunits: orgUnitArray.filter((orgunit) => orgunit.type === 'ORGANISATION_UNIT'),
      user_orgunits: [],
      type: 'report',
      selected_user_orgunit: selectedUserOrgUnit.map((userorgunit) => {
        return {
          id: userorgunit.id,
          shown: true
        }
      })
    };
    return orgUnitModel;
  }

  updateVisualizationWithChartType(chartType: string) {
    const visualization: Visualization = {...this.visualizationObject};

    visualization.layers = _.map(visualization.layers, (layer: any) => {
      const newLayer = _.clone(layer);
      const newSettings: any = {...layer.settings};
      newSettings.type = chartType;

      newLayer.settings = {...newSettings};
      return newLayer;
    });

    visualization.operatingLayers = _.map(visualization.layers, (layer: any) => {
      const newLayer = _.clone(layer);
      const newSettings: any = {...layer.settings};
      newSettings.type = chartType;

      newLayer.settings = {...newSettings};
      return newLayer;
    });

    this.store.dispatch(new fromAction.SaveVisualization(visualization));

  }
}
