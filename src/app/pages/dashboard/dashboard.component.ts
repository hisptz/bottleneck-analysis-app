import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {dashboardNameSelector} from "../../store/selectors/dashboard-name.selector";
import {ActivatedRoute} from "@angular/router";
import {CurrentDashboardChangeAction, LoadVisualizationObjectAction} from "../../store/actions";
import {currentDashboardItemsSelector} from "../../store/selectors/current-dashboard-items.selector";
import {currentDeletedDashboardSelector} from "../../store/selectors/current-deleted-dashboard.selector";
import {Visualization} from "../../model/visualization";
import {currentVisualizationObjectsSelector} from "../../store/selectors/current-visualization-objects.selector";
import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dashboardName$: Observable<string>;
  visualizationObjects$: Observable<any[]>;
  currentDashboard: string;
  cardConfiguration: any = {
    hideCardBorders: false,
    showCardHeader: true,
    showCardFooter: true,
    defaultHeight: "400px",
    defaultItemHeight: "380px",
    fullScreenItemHeight: "75vh",
    fullScreenHeight: "80vh"
  };
  constructor(
    private store: Store<ApplicationState>,
    private route: ActivatedRoute
  ) {
     this.dashboardName$ = store.select(dashboardNameSelector);
     this.visualizationObjects$ = store.select(currentVisualizationObjectsSelector);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentDashboard = params['id'];
      this.store.dispatch(new CurrentDashboardChangeAction(params['id']));

      this.store.select(currentDashboardItemsSelector).subscribe(dashboardItems => {
        dashboardItems.forEach(dashboardItem => {
          if(!dashboardItem.hasOwnProperty('visualizationObject')) {
            const visualizationObject: Visualization = this.getInitialVisualization(dashboardItem,this.cardConfiguration, this.currentDashboard);
            this.store.dispatch(new LoadVisualizationObjectAction(visualizationObject))
          }
        });
      })
    })
  }

  getInitialVisualization(cardData, cardConfiguration, dashboardId): Visualization {

    return {
      id: cardData.hasOwnProperty('id') ? cardData.id : null,
      name: null,
      type: cardData.hasOwnProperty('type') ? cardData.type : null,
      created: cardData.hasOwnProperty('created') ? cardData.created : null,
      lastUpdated: cardData.hasOwnProperty('lastUpdated') ? cardData.lastUpdated: null,
      shape: cardData.hasOwnProperty('shape') ? cardData.shape : 'NORMAL',
      dashboardId: dashboardId,
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
}
