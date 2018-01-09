import {Component, Input, OnInit} from '@angular/core';
import {Visualization} from '../../../../../store/visualization/visualization.state';
import {Store} from '@ngrx/store';
import * as _ from 'lodash';
import {AppState} from '../../../../../store/app.reducers';
import * as visualization from '../../../../../store/visualization/visualization.actions';
import {OrgUnitModel} from '../../../../../modules/org-unit-filter/models/orgunit.model';

@Component({
  selector: 'app-visualization-card',
  templateUrl: './visualization-card.component.html',
  styleUrls: ['./visualization-card.component.css']
})
export class VisualizationCardComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  @Input() customCardHeight: string;
  @Input() customItemHeight: string;
  @Input() hideResizeBlock: boolean;

  isCardFocused: boolean;
  selectedDimensions: any;
  currentVisualization: string;
  loaded: boolean;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    this.selectedDimensions = this.getSelectedDimensions();

    this.currentVisualization = this.visualizationObject.details.currentVisualization;

    this.loaded = this.visualizationObject.details.loaded;
  }

  currentVisualizationChange(visualizationType: string) {
    this.store.dispatch(new visualization.VisualizationChangeAction({
      type: visualizationType,
      id: this.visualizationObject.id
    }));
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
          };
        });
      }
    }
    return [];
  }

  private _getSelectedOrgUnitModel(orgUnitArray): OrgUnitModel {
    const selectedOrgUnitLevels = orgUnitArray.filter((orgunit) => orgunit.id.indexOf('LEVEL') !== -1);
    const selectedUserOrgUnit = orgUnitArray.filter((orgunit) => orgunit.id.indexOf('USER') !== -1);
    const selectedOrgUnitGroups = orgUnitArray.filter((orgunit) => orgunit.id.indexOf('OU_GROUP') !== -1);

    return {
      selectionMode: selectedOrgUnitLevels.length > 0 ? 'Level' : selectedOrgUnitGroups.length > 0 ? 'Group' : 'orgUnit',
      selectedLevels: selectedOrgUnitLevels.map((orgunitlevel) => {
        return {
          level: orgunitlevel.id.split('-')[1]
        };
      }),
      showUpdateButton: true,
      selectedGroups: selectedOrgUnitGroups,
      orgUnitLevels: [],
      orgUnitGroups: [],
      selectedOrgUnits: orgUnitArray.filter((orgUnit: any) => orgUnit.type === 'ORGANISATION_UNIT'),
      userOrgUnits: [],
      type: 'report',
      selectedUserOrgUnits: selectedUserOrgUnit.map((userorgunit) => {
        return {
          id: userorgunit.id,
          shown: true
        };
      }),
      orgUnits: []
    };
  }

  onFilterUpdate(filterValue: any) {
    this.store.dispatch(new visualization.LocalFilterChangeAction(
      {visualizationObject: this.visualizationObject, filterValue: filterValue}));
  }

  onLayoutUpdate(layoutOptions: any) {

    const newVisualizationObjectDetails = {...this.visualizationObject.details};

    // TODO use only single place for saving layout options
    const visualizationLayouts = _.map(newVisualizationObjectDetails.layouts, (layoutObject: any) => {
      return {
        ...layoutObject,
        layout: layoutOptions
      };
    });

    const visualizationLayers = _.map(this.visualizationObject.layers, (layer: any) => {
      return {
        ...layer,
        layout: layoutOptions
      };
    });

    this.store.dispatch(new visualization.AddOrUpdateAction({
      visualizationObject: {
        ...this.visualizationObject,
        details: {
          ...newVisualizationObjectDetails,
          layouts: [...visualizationLayouts]
        },
        layers: visualizationLayers
      }, placementPreference: 'normal'
    }));
  }

  toggleCardFocusAction(e, isFocused) {
    e.stopPropagation();
    this.isCardFocused = isFocused;
  }

  getSelectedDimensions() {
    return this.visualizationObject.details
    && this.visualizationObject.details.filters.length > 0 && this.visualizationObject.details.layouts.length > 0 ? {
      selectedDataItems: this.getSelectedItems(this.visualizationObject.details.filters, 'dx'),
      selectedPeriods: this.getSelectedItems(this.visualizationObject.details.filters, 'pe'),
      orgUnitModel: this._getSelectedOrgUnitModel(this.getSelectedItems(this.visualizationObject.details.filters, 'ou')),
      layoutModel: this.visualizationObject.details.layouts[0].layout
    } : null;
  }

}
