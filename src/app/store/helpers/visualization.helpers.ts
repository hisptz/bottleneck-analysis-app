import * as _ from 'lodash';
import {Visualization} from '../../dashboard/model/visualization';

export function updateVisualizationWithSettings(visualization: Visualization, settings: any) {
  const newVisualization: Visualization = {...visualization};

  const visualizationDetails: any = {...newVisualization.details};
  if (settings.mapViews) {
    let visualizationFilters = [];
    let visualizationLayouts = [];
    let visualizationInterpretations = [];
    if (visualizationDetails.currentVisualization === 'MAP') {
      visualizationDetails.basemap = settings.basemap;
      visualizationDetails.zoom = settings.zoom;
      visualizationDetails.latitude = settings.latitude;
      visualizationDetails.longitude = settings.longitude;
    }
    settings.mapViews.forEach((view: any) => {
      visualizationFilters = [...visualizationFilters, {id: view.id, filters: getVisualizationFilters(view)}];
      visualizationLayouts = [...visualizationLayouts, {id: view.id, layout: getVisualizationLayout(view)}];
      visualizationInterpretations = [...visualizationInterpretations, {
        id: view.id,
        interpretations: view.interpretations
      }];
    });

    visualizationDetails.filters = [...visualizationFilters];
    visualizationDetails.layouts = [...visualizationLayouts];
    visualizationDetails.interpretations = [...visualizationInterpretations];

    newVisualization.layers = [..._.map(settings.mapViews, (view: any) => {
      const newView: any = {...view};
      return {settings: newView};
    })];
  } else {
    const newSettings = {...settings};
    visualizationDetails.filters = [{id: settings.id, filters: getVisualizationFilters(settings)}];
    visualizationDetails.layouts = [{id: settings.id, layout: getVisualizationLayout(settings)}];
    visualizationDetails.interpretations = [{id: settings.id, interpretations: settings.interpretations}];

    newVisualization.layers = [{settings: newSettings}];
  }

  newVisualization.details = {...visualizationDetails};
  return newVisualization;
}

function getVisualizationLayout(visualizationSettings: any) {
  return {
    rows: getDimensionLayout(visualizationSettings.rows, visualizationSettings.dataElementDimensions),
    columns: getDimensionLayout(visualizationSettings.columns, visualizationSettings.dataElementDimensions),
    filters: getDimensionLayout(visualizationSettings.filters, visualizationSettings.dataElementDimensions)
  };
}

function getDimensionLayout(dimensionArray, dataElementDimensions) {
  const newDimensionLayoutArray: any[] = [];
  if (dimensionArray) {
    dimensionArray.forEach(dimensionObject => {
      if (dimensionObject.dimension !== 'dy') {
        const layoutValue = dimensionObject.dimension;
        const layoutName = getLayoutName(layoutValue, dataElementDimensions);
        newDimensionLayoutArray.push({name: layoutName, value: layoutValue});
      }
    });
  }
  return newDimensionLayoutArray;
}

function getLayoutName(layoutValue, dataElementDimensions) {
  switch (layoutValue) {
    case 'ou': {
      return 'Organisation Unit';
    }

    case 'pe': {
      return 'Period';
    }

    case 'dx': {
      return 'Data';
    }

    default: {
      let layoutName = '';
      if (dataElementDimensions) {
        const compiledDimension = dataElementDimensions.map(dataElementDimension => {
          return dataElementDimension.dataElement;
        });
        const layoutObject = _.find(compiledDimension, ['id', layoutValue]);
        if (layoutObject) {
          layoutName = layoutObject.name;
        }
      }
      return layoutName !== '' ? layoutName : 'Category Option';
    }
  }

}

function getVisualizationFilters(visualizationSettings: any) {
  const visualizationFilters: any = [
    ...getDimensionValues(visualizationSettings.rows, visualizationSettings.dataElementDimensions),
    ...getDimensionValues(visualizationSettings.columns, visualizationSettings.dataElementDimensions),
    ...getDimensionValues(visualizationSettings.filters, visualizationSettings.dataElementDimensions)
  ];
  return visualizationFilters;
}

export function getDimensionValues(dimensionArray: any, dataDimensions) {
  const dimensionValues: any[] = [];
  const newDataDimensions: any[] = _.map(dataDimensions, dataDimension => dataDimension.dataElement);
  const readableDimensionValues: any = {};
  if (dimensionArray) {
    dimensionArray.forEach((dimensionObject: any) => {
      if (dimensionObject.dimension !== 'dy') {

        const dimensionValue = {
          name: '',
          value: '',
          items: []
        };

        const currentDataDimension: any = _.find(newDataDimensions, ['id', dimensionObject.dimension]);

        if (currentDataDimension) {
          dimensionValue['options'] = currentDataDimension.optionSet ? currentDataDimension.optionSet.options : [];
        }

        /**
         * Get dimension name
         */
        let dimensionName = dimensionObject.dimension;
        dimensionName += dimensionObject.legendSet ? '-' + dimensionObject.legendSet.id : '';
        dimensionValue.name = dimensionName;

        /**
         * Get dimension items
         */
        dimensionValue.items = dimensionObject.items;

        /**
         * Get dimension value
         */
        if (dimensionObject.items) {
          readableDimensionValues[dimensionObject.dimension] = dimensionObject.items.map(item => {
            return {
              id: item.dimensionItem,
              name: item.displayName,
              itemType: item.dimensionItemType
            }
          });

          const itemValues = dimensionObject.items.map(item => {
            return item.dimensionItem ? item.dimensionItem : ''
          }).join(';')
          dimensionValue.value = itemValues !== '' ? itemValues : dimensionObject.filter ? dimensionObject.filter : '';
        }
        dimensionValues.push(dimensionValue);
      }
    });
  }

  return dimensionValues;
}

function getVisualizationObjectName(dashboardItem): string {
  return dashboardItem.type !== null && dashboardItem.hasOwnProperty(_.camelCase(dashboardItem.type))
    ? _.isPlainObject(dashboardItem[_.camelCase(dashboardItem.type)])
      ? dashboardItem[_.camelCase(dashboardItem.type)].displayName : null : null;
}


function getSanitizedCurrentVisualizationType(visualizationType: string): string {
  let sanitizedVisualization: string = null;

  if (visualizationType === 'CHART' || visualizationType === 'EVENT_CHART') {
    sanitizedVisualization = 'CHART';
  } else if (visualizationType === 'TABLE' || visualizationType === 'EVENT_REPORT' || visualizationType === 'REPORT_TABLE') {
    sanitizedVisualization = 'TABLE';
  } else if (visualizationType === 'MAP') {
    sanitizedVisualization = 'MAP';
  } else {
    sanitizedVisualization = visualizationType;
  }
  return sanitizedVisualization;
}

export function getVisualizationSettingsUrl(apiRootUrl: string, visualizationType: string, settingsId: string): string {
  let url: string = apiRootUrl + visualizationType + 's/' + settingsId + '.json?fields=';
  if (visualizationType === 'map') {
    url += 'id,displayName,longitude,latitude,zoom,basemap,mapViews[*,organisationUnitGroupSet[id,name,displayName,' +
      'organisationUnitGroups[id,code,name,shortName,displayName,dimensionItem,symbol,organisationUnits[id,code,name,shortName]]]' +
      ',dataElementDimensions[dataElement[id,name,optionSet[id,options[id,name,code]]]],columns[dimension,filter,items[dimensionItem,' +
      'dimensionItemType,displayName]],rows[dimension,filter,items[dimensionItem,dimensionItemType,displayName]],filters[dimension,' +
      'filter,items[dimensionItem,dimensionItemType,displayName]],dataDimensionItems,program[id,displayName],programStage[id,displayName]' +
      ',legendSet[id,displayName,legends[*]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,' +
      '!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,' +
      '!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,' +
      '!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,!sortOrder,' +
      '!topLimit]';
  } else {
    url += '*,!user,interpretations[*],dataElementDimensions[dataElement[id,name,optionSet[id,options[id,name,code]]]],' +
      'displayDescription,program[id,name],programStage[id,name],legendSet[*,legends[*]],interpretations[*,user[id,displayName],' +
      'likedBy[id,displayName],comments[lastUpdated,text,user[id,displayName]]],columns[dimension,filter,legendSet,' +
      'items[id,dimensionItem,dimensionItemType,displayName]],rows[dimension,filter,legendSet,' +
      'items[id,dimensionItem,dimensionItemType,displayName]],filters[dimension,filter,legendSet,' +
      'items[id,dimensionItem,dimensionItemType,displayName]],access,userGroupAccesses,publicAccess,displayDescription,' +
      'user[displayName,dataViewOrganisationUnits],!href,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,' +
      '!userOrganisationUnitGrandChildren,!externalAccess,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,' +
      '!organisationUnitGroups,!itemOrganisationUnitGroups,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,' +
      '!periods,!organisationUnitLevels,!organisationUnits';
  }
  return settingsId ? url : '';
}

export function updateVisualizationWithCustomFilters(visualization: Visualization, customfilterObject: any) {
  const newVisualization: Visualization = _.cloneDeep(visualization);
  const filterArray: any[] = [...visualization.details.filters];

  const newFilterArray: any[] = filterArray.map((filterObject: any) => {
    const newFilterObject: any = {...filterObject};
    const newFilters = filterObject.filters.map((filter: any) => {
      const newFilter: any = {...filter};
      if (customfilterObject.name === newFilter.name) {
        newFilter.value = customfilterObject.value;
        newFilter.items = [...mapFilterItemsToFavoriteFormat(customfilterObject.items, filter.name)];
      }
      return newFilter;
    });

    newFilterObject.filters = [...newFilters];
    return newFilterObject;
  });

  newVisualization.details.filters = [...newFilterArray];

  // TODO FIND BEST WAY TO MAKE FILTER CHANGES CONSISTENCE
  /**
   * Also update layers with filters
   */

  newVisualization.operatingLayers = [...updateLayersWithCustomFilters(newVisualization.operatingLayers, newFilterArray)];

  newVisualization.layers = [...newVisualization.operatingLayers];

  return newVisualization;
}

export function mapFilterItemsToFavoriteFormat(filterItems, dimensionType) {
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
        startingName: filterItem.startingName,
        displayName: filterItem.name,
        dimensionItemType: filterItem.id.indexOf('LEVEL') !== -1 ? 'LEVEL' :
          filterItem.id.indexOf('OU_GROUP') !== -1 ? 'GROUP' : 'ORGANISATION_UNIT'
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

export function updateLayersWithCustomFilters(visualizationLayers, customFilters) {
  return _.map(visualizationLayers, (layer) => {
    const newLayer = _.clone(layer);
    const newSettings = _.clone(layer.settings);
    const correspondingFilter = _.find(customFilters, ['id', layer.settings.id]);
    if (correspondingFilter) {
      newSettings.columns = updateLayoutDimensionWithFilters(newSettings.columns, correspondingFilter.filters);
      newSettings.rows = updateLayoutDimensionWithFilters(newSettings.rows, correspondingFilter.filters);
      newSettings.filters = updateLayoutDimensionWithFilters(newSettings.filters, correspondingFilter.filters);
    }

    newLayer.settings = {...newSettings};
    return newLayer;
  });
}

function updateLayoutDimensionWithFilters(layoutDimensionArray, filters) {
  return _.map(layoutDimensionArray, (layoutDimension) => {
    const newLayoutDimension = _.clone(layoutDimension);
    const dimensionObject = _.find(filters, ['name', layoutDimension.dimension]);

    /**
     * Get items
     */
    if (dimensionObject) {
      newLayoutDimension.items = _.assign([], dimensionObject.items);
    }

    return newLayoutDimension;
  });
}

export function getSanitizedCustomFilterObject(filterObject) {

  const newFilterValue = filterObject.selectedData ? filterObject.selectedData : filterObject;
  const newFilterItems = filterObject.items ? filterObject.items : filterObject.itemList;
  return {name: newFilterValue.name, value: newFilterValue.value, items: newFilterItems};
}
