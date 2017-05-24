import {Component, OnInit, Input, ViewChild, OnChanges, ChangeDetectionStrategy} from '@angular/core';
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
  styleUrls: ['./dashboard-item-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardItemCardComponent implements OnInit, OnChanges {

  @Input() visualizationObject: Visualization;
  @Input() currentDashboard: string;
  visualizationObject$: Observable<any>;

  dashboardShapes: any[] = DASHBOARD_SHAPES;
  visualizationWithNoOptions: any[] = VISUALIZATION_WITH_NO_OPTIONS;
  showFullScreen: boolean = false;
  currentVisualization: string;
  customFilters: any[] = [];
  cardConfiguration: any = {
    hideCardBorders: false,
    showCardHeader: true,
    showCardFooter: true,
    defaultHeight: "400px",
    defaultItemHeight: "380px",
    fullScreenItemHeight: "75vh",
    fullScreenHeight: "80vh"
  };
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
    this.currentVisualization = this.visualizationObject.type;
    /**
     * Get initial visualization object to pass to lower components
     * @type {Visualization}
     */
    this.visualizationObject$ = Observable.of(this.visualizationObject);
  }

  ngOnChanges() {

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

  deleteDashboardItem(currentDashboard, dashboardItem) {
    this.store.dispatch(new DeleteDashboardItemAction({dashboardId: currentDashboard, id: dashboardItem}))
  }

}
