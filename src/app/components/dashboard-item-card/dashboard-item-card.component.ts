import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {Visualization} from "../../model/visualization";
import * as _ from 'lodash';
import {FavoriteService} from "../../services/favorite.service";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {loadedVisualizationSelector} from "../../store/selectors/loaded-visualizations.selector";
import {
  LoadVisualizationObjectAction, ChangeCurrentVisualizationAction,
  ChangeFiltersAction, ChangeLayoutAction, DeleteDashboardItemAction
} from "../../store/actions";
import {Observable} from "rxjs";
import {visualizationObjectsSelector} from "../../store/selectors/visualization-objects.selector";
import {MapComponent} from "../map/map.component";
import {ChartComponent} from "../chart/chart.component";
import {TableComponent} from "../table/table.component";

export const VISUALIZATION_WITH_NO_OPTIONS = ['USERS', 'REPORTS', 'RESOURCES', 'APP'];

export const DASHBOARD_SHAPES = [
  {
    shape: 'NORMAL',
    shapeClasses: ['col-md-4', 'col-sm-6', 'col-xs-12','dashboard-card']
  },
  {
    shape: 'DOUBLE_WIDTH',
    shapeClasses: ['col-md-8', 'col-sm-6', 'col-xs-12','dashboard-card']
  },
  {
    shape: 'FULL_WIDTH',
    shapeClasses: ['col-md-12', 'col-sm-12', 'col-xs-12','dashboard-card']
  },
];

@Component({
  selector: 'app-dashboard-item-card',
  templateUrl: './dashboard-item-card.component.html',
  styleUrls: ['./dashboard-item-card.component.css']
})
export class DashboardItemCardComponent implements OnInit {

  @Input() cardData: any = {};
  @Input() currentDashboard: string;
  visualizationObject: Visualization;
  visualizationObject$: Observable<any>;
  cardConfiguration: any = {
    hideCardBorders: false,
    showCardHeader: true,
    showCardFooter: true,
    defaultHeight: "400px",
    defaultItemHeight: "380px",
    fullScreenItemHeight: "75vh",
    fullScreenHeight: "80vh"
  };

  dashboardShapes: any[] = DASHBOARD_SHAPES;
  visualizationWithNoOptions: any[] = VISUALIZATION_WITH_NO_OPTIONS;
  showFullScreen: boolean = false;
  currentVisualization: string;
  customFilters: any[] = [];
  @ViewChild(MapComponent) mapComponent: MapComponent;
  @ViewChild(ChartComponent) chartComponent: ChartComponent;
  @ViewChild(TableComponent) tableComponent: TableComponent;
  constructor(private store: Store<ApplicationState>) {
  }

  ngOnInit() {
    /**
     * get current visualization
     * @type {any}
     */
    this.currentVisualization = this.cardData.type;
    /**
     * Get initial visualization object to pass to lower components
     * @type {Visualization}
     */
    this.visualizationObject = this.getInitialVisualization(this.cardData, this.cardConfiguration);


    this.store.select(visualizationObjectsSelector).subscribe(visualizationObjects => {
      const currentVisualizationObject: any = _.find(visualizationObjects, ['id', this.visualizationObject.id]);
      this.visualizationObject$ = Observable.of(currentVisualizationObject);

      if(currentVisualizationObject != undefined) {
        this.visualizationObject = currentVisualizationObject;
        this.currentVisualization = currentVisualizationObject.details.currentVisualization;

        /**
         *  Refresh components
         */
        setTimeout(() => {
          if(this.currentVisualization == 'CHART') {
            this.chartComponent.loadChart();
          } else if(this.currentVisualization == 'TABLE') {
            this.tableComponent.loadTable();
          } else if(this.currentVisualization == 'MAP') {
            this.mapComponent.loadMap();
          }
        }, 10)
      }

    });

    this.store.select(loadedVisualizationSelector).subscribe(visualizations => {
      if(_.indexOf(visualizations, this.visualizationObject.id) == -1) {
        this.store.dispatch(new LoadVisualizationObjectAction(this.visualizationObject))
      }
    });

  }

  /**
   * Hide options for
   * @param visualizationType
   * @param visualizationWithNoOptions
   * @returns {boolean}
   */
  hideOptions(visualizationType, visualizationWithNoOptions: any[] = []): boolean {
    let hide = false;
    if(visualizationWithNoOptions != undefined && visualizationWithNoOptions.length > 0) {
      visualizationWithNoOptions.forEach(visualizationValue => {
        if (visualizationType == visualizationValue) {
          hide = true;
        }
      });
    }
    return hide;
  }

  updateFilters(filterValues): void {
    const filterArray = _.isPlainObject(filterValues) ? [filterValues] : filterValues;
    const visualizationObject = this.visualizationObject;
    if(visualizationObject.details.filters.length > 0) {
      filterArray.forEach(filter => {
        const existingFilter = _.find(visualizationObject.details.filters, ['name', filter.name]);
        if(!existingFilter) {
          visualizationObject.details.filters.push(filter)
        } else {
          visualizationObject.details.filters[_.indexOf(visualizationObject.details.filters, existingFilter)] = filter;
        }
      });

    } else {
      visualizationObject.details.filters = filterArray;
    }

    this.store.dispatch(new ChangeFiltersAction(visualizationObject));
    // this.customFilters = filterValues;
  }

  updateLayout(layout) {
    this.visualizationObject.details.layout = layout;
    this.store.dispatch(new ChangeLayoutAction(this.visualizationObject))
  }


  /**
   * Function for resizing dashboard card from normal,double width to full width
   * @param currentShape
   * @param shapes
   */
  resizeDashboard(currentShape: string, shapes: any[] = []): void {
    let newShape: string = 'NORMAL';
    if(shapes != undefined && shapes.length > 1) {
      shapes.forEach((shapeValue, shapeIndex) => {
        if(shapeValue.hasOwnProperty('shape') && shapeValue.shape == currentShape) {
          if (shapeIndex + 1 < shapes.length) {
            newShape = shapes[shapeIndex + 1].shape
          }
        }
      });
    }

    //@todo update in the system also
    this.visualizationObject.shape = newShape;

    //also resize map
    this.mapComponent.resizeMap(newShape,'shape');
  }

  /**
   * Function to get classes for the selected shape
   * @param currentShape
   * @param shapes
   * @returns {any[]}
   */
  getDashboardShapeClasses(currentShape, shapes: any[] = []): any[] {
    let shapeClasses: any[] = ['col-md-4', 'col-sm-6', 'col-xs-12','dashboard-card'];
    if(shapes != undefined && shapes.length > 1) {
      for(let shapeValue of shapes) {
        if(shapeValue.hasOwnProperty('shape') && shapeValue.shape == currentShape) {
          if(shapeValue.hasOwnProperty('shapeClasses')) {
            shapeClasses = shapeValue.shapeClasses;
          }
        }
      }
    }

    return shapeClasses;
  }

  /**
   * Function to open or close full screen view of the dashbaord card
   */
  toggleFullScreen(): void {
    /**
     * Change card height when toggling full screen to enable items to stretch accordingly
     */
    if(this.showFullScreen) {
      this.visualizationObject.details.cardHeight = this.cardConfiguration.defaultHeight;
      this.visualizationObject.details.itemHeight = this.cardConfiguration.defaultItemHeight;
    } else {
      this.visualizationObject.details.cardHeight = this.cardConfiguration.fullScreenHeight;
      this.visualizationObject.details.itemHeight = this.cardConfiguration.fullScreenItemHeight;
    }

    this.showFullScreen = !this.showFullScreen;
    this.mapComponent.resizeMap(this.showFullScreen,'fullScreen');
  }

  updateVisualization(selectedVisualization) {
    const visualizationObject: Visualization = _.clone(this.visualizationObject);
    visualizationObject.details.currentVisualization = selectedVisualization;
    if(selectedVisualization == 'MAP') {
      visualizationObject.details.analyticsStrategy = 'split';
    } else {
      visualizationObject.details.analyticsStrategy = 'merge';
    }

    this.store.dispatch(new ChangeCurrentVisualizationAction(visualizationObject));
    this.currentVisualization = selectedVisualization;
  }

  getInitialVisualization(cardData, cardConfiguration): Visualization {

    return {
      id: cardData.hasOwnProperty('id') ? cardData.id : null,
      name: null,
      type: cardData.hasOwnProperty('type') ? cardData.type : null,
      created: cardData.hasOwnProperty('created') ? cardData.created : null,
      lastUpdated: cardData.hasOwnProperty('lastUpdated') ? cardData.lastUpdated: null,
      shape: cardData.hasOwnProperty('shape') ? cardData.shape : 'NORMAL',
      details: {
        cardHeight: cardConfiguration.defaultHeight,
        itemHeight: cardConfiguration.defaultItemHeight,
        currentVisualization: this.getsanitizedCurrentVisualizationType(cardData.hasOwnProperty('type') ? cardData.type : null),
        favorite: this.getFavoriteDetails(cardData),
        externalDimensions: {},
        filters: [],
        layout: {},
        analyticsStrategy: 'merge'
      },
      layers: this.getLayerDetailsForNonVisualizableObject(cardData),
      operatingLayers: []
    }
  }

  getFavoriteDetails(cardData) {
    return cardData.type != null && cardData.hasOwnProperty(_.camelCase(cardData.type)) ? {
        id: _.isPlainObject(cardData[_.camelCase(cardData.type)]) ? cardData[_.camelCase(cardData.type)].id : undefined,
        type: _.camelCase(cardData.type)
      } : {};
  }

  getLayerDetailsForNonVisualizableObject(cardData) {
    let layer: any = [];
    if(cardData.type == 'USERS' || cardData.type == 'REPORTS' || cardData.type == 'RESOURCES' || cardData.type == 'APP') {
      layer.push({settings: cardData, analytics: {}});
    }
    return layer
  }

  getsanitizedCurrentVisualizationType(visualizationType: string): string {
    let sanitizedVisualization: string = null;

    if(visualizationType == 'CHART' || visualizationType == 'EVENT_CHART') {
      sanitizedVisualization = 'CHART';
    } else if(visualizationType == 'TABLE' || visualizationType == 'EVENT_REPORT' || visualizationType == 'REPORT_TABLE') {
      sanitizedVisualization = 'TABLE';
    } else if(visualizationType == 'MAP') {
      sanitizedVisualization = 'MAP';
    } else {
      sanitizedVisualization = visualizationType;
    }
    return sanitizedVisualization
  }

  deleteDashboardItem(currentDashboard, dashboardItem) {
    this.store.dispatch(new DeleteDashboardItemAction({dashboardId: currentDashboard, id: dashboardItem}))
  }

}
