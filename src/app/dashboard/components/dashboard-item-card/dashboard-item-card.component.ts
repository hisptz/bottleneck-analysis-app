import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import {Visualization} from '../../model/visualization';
import * as _ from 'lodash';
import {ApplicationState} from '../../../store/application-state';
import {Store} from '@ngrx/store';
import {apiRootUrlSelector} from '../../../store/selectors/api-root-url.selector';
import {
  ResizeDashboardAction, UpdateVisualizationWithCustomFilterAction
} from '../../../store/actions';
import {ChartComponent} from '../chart/chart.component';
import {Observable} from 'rxjs/Observable';

export const VISUALIZATION_WITH_NO_OPTIONS = ['USERS', 'REPORTS', 'RESOURCES', 'APP', 'MESSAGES'];

export const DASHBOARD_SHAPES = [
  {
    shape: 'NORMAL',
    shapeClasses: ['col-md-4', 'col-sm-6', 'col-xs-12', 'dashboard-card']
  },
  {
    shape: 'DOUBLE_WIDTH',
    shapeClasses: ['col-md-8', 'col-sm-6', 'col-xs-12', 'dashboard-card']
  },
  {
    shape: 'FULL_WIDTH',
    shapeClasses: ['col-md-12', 'col-sm-12', 'col-xs-12', 'dashboard-card']
  },
];

@Component({
  selector: 'app-dashboard-item-card',
  templateUrl: './dashboard-item-card.component.html',
  styleUrls: ['./dashboard-item-card.component.css']
})
export class DashboardItemCardComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  @Input() globalFilters: Observable<any>;
  @Output() onFilterReset: EventEmitter<any> = new EventEmitter<any>()
  dashboardShapes: any[] = DASHBOARD_SHAPES;
  visualizationWithNoOptions: any[] = VISUALIZATION_WITH_NO_OPTIONS;
  currentVisualization: string;
  cardConfiguration: any = {
    hideCardBorders: false,
    showCardHeader: true,
    showCardFooter: false,
    showDeleteButton: false,
    confirmDelete: false,
    defaultHeight: '460px',
    defaultItemHeight: '420px',
    fullScreenItemHeight: '91vh',
    fullScreenHeight: '97vh',
    fullScreen: false,
    showOptions: true,
    showFilter: false,
    optionsVisibility: 'hidden',
    blockWidth: '100%',
    showMailButton: true,
    showResizeButton: false,
    showFullScreen: false,
    showDownloadOptions: false
  };
  @ViewChild('dashboardItemBody') dashboardItemBody: ElementRef;
  @ViewChild(ChartComponent)
  chartComponent: ChartComponent;
  showFavoriteSettings: boolean = false;
  currentShape: string;
  constructor(private store: Store<ApplicationState>) { }

  ngOnInit() {
    /**
     * Set initial card height and visualization type
     * @type {string}
     */
    this.visualizationObject.details.cardHeight = this.cardConfiguration.defaultHeight;
    this.visualizationObject.details.itemHeight = this.cardConfiguration.defaultItemHeight;
    this.currentVisualization = this.visualizationObject.details.currentVisualization;
    this.currentShape = this.visualizationObject.shape;
    // console.log(JSON.stringify(this.visualizationObject))

    // this.globalFilters.subscribe(globalFilters => {
    //   console.log(globalFilters)
    //   if (globalFilters !== null) {
    //     this.updateFilters(globalFilters);
    //     this.onFilterReset.emit(null);
    //   }
    // })
  }

  getDashboardShapeClasses(currentShape, shapes: any[] = []): any[] {
    let shapeClasses: any[] = ['col-md-4', 'col-sm-6', 'col-xs-12'];
    if (shapes !== undefined && shapes.length > 1) {
      for (const shapeValue of shapes) {
        if (shapeValue.hasOwnProperty('shape') && shapeValue.shape === currentShape) {
          if (shapeValue.hasOwnProperty('shapeClasses')) {
            shapeClasses = shapeValue.shapeClasses;
          }
        }
      }
    }
    return shapeClasses;
  }

  getMouseAction(visualizationType, event) {
    /**
     * Footer actions
     */
    if (!this.hideOptions(visualizationType, this.visualizationWithNoOptions)) {
      this.cardConfiguration.showCardFooter = !this.cardConfiguration.showCardFooter;
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

  resizeDashboard(currentShape: string, shapes: any[] = []): void {
    let newShape = 'NORMAL';
    const visualizationObject: Visualization = _.clone(this.visualizationObject);
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
    this.currentShape = newShape;

    this.visualizationObject = visualizationObject;

    this.resizeChildren();

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

  resizeChildren() {
    if (this.chartComponent) {
      this.chartComponent.resize();
    }
  }

  toggleFullScreen(): void {
    /**
     * Change card height when toggling full screen to enable items to stretch accordingly
     */
    if (this.cardConfiguration.showFullScreen) {
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
      this.visualizationObject.details.cardHeight = this.cardConfiguration.defaultHeight;
      this.visualizationObject.details.itemHeight = this.cardConfiguration.defaultItemHeight;
    } else {
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
      this.visualizationObject.details.cardHeight = this.cardConfiguration.fullScreenHeight;
      this.visualizationObject.details.itemHeight = this.cardConfiguration.fullScreenItemHeight;
    }

    this.cardConfiguration.showFullScreen = !this.cardConfiguration.showFullScreen;
  }

  updateVisualization(selectedVisualization) {

  }

  updateFilters(filterValue) {
    const filterArray = this.visualizationObject.details.filters;
    const newVisualizationObject = _.clone(this.visualizationObject);
    if (filterArray) {
      filterArray.forEach(filterObject => {
        filterObject.filters.forEach(filter => {
          if (filterValue.name === filter.name) {
            filter.value = filterValue.value;
          }
        })
      })
    }
    this.store.select(apiRootUrlSelector).subscribe(apiRootUrl => {
      if (apiRootUrl !== '') {
        this.store.dispatch(new UpdateVisualizationWithCustomFilterAction(
          {
            apiRootUrl: apiRootUrl,
            visualizationObject: newVisualizationObject,
            filters: filterArray
          }))
      }
    })
  }

  toggleFavoriteSettings(event?) {
    // if (this.showFavoriteSettings) {
    //   this.visualizationObject.shape = this.currentShape;
    // } else {
    //   if (this.currentShape === 'NORMAL') {
    //     this.visualizationObject.shape = 'DOUBLE_WIDTH';
    //   }
    // }

    this.showFavoriteSettings = !this.showFavoriteSettings;
  }

  getVisualizationSettings(visualizationLayers) {
    return visualizationLayers.map(layer => {return layer.settings});
  }

  updateFavoriteOptions() {
    console.log(this.visualizationObject)
  }

}
