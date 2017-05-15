import {Component, OnInit, Input} from '@angular/core';
import {Visualization} from "../../model/visualization";
import * as _ from 'lodash';
import {FavoriteService} from "../../services/favorite.service";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {loadedVisualizationSelector} from "../../store/selectors/loaded-visualizations.selector";
import {
  LoadVisualizationObjectAction, ChangeCurrentVisualizationAction,
  ChangeFiltersAction, ChangeLayoutAction
} from "../../store/actions";
import {Observable} from "rxjs";
import {visualizationObjectsSelector} from "../../store/selectors/visualization-objects.selector";

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
      let currentVisualizationObject: any = visualizationObjects.filter(object => {return object.id == this.visualizationObject.id})[0];

      if(currentVisualizationObject != undefined) {
        this.visualizationObject = currentVisualizationObject;
      }

      this.visualizationObject$ = Observable.of(currentVisualizationObject);


      // if(this.visualizationObject$.hasOwnProperty('details') && this.visualizationObject$.details.hasOwnProperty('currentVisualization')) {
      //   this.currentVisualization = this.visualizationObject$.details.currentVisualization;
      // }
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

    this.visualizationObject.details.filters = _.isPlainObject(filterValues) ? [filterValues] : filterValues;
    this.store.dispatch(new ChangeFiltersAction(this.visualizationObject));

    this.customFilters = filterValues;
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
  }

  updateVisualization(selectedVisualization) {
    this.visualizationObject.details.currentVisualization = selectedVisualization;
    this.store.dispatch(new ChangeCurrentVisualizationAction(this.visualizationObject));
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
        analyticsStrategy: 'normal'
      },
      layers: [],
      operatingLayers: []
    }
  }

  getFavoriteDetails(cardData) {
    return cardData.type != null && cardData.hasOwnProperty(_.camelCase(cardData.type)) ? {
        id: _.isPlainObject(cardData[_.camelCase(cardData.type)]) ? cardData[_.camelCase(cardData.type)].id : undefined,
        type: _.camelCase(cardData.type)
      } : {};
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

}
