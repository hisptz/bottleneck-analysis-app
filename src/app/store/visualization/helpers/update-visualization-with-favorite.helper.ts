import {Visualization} from '../visualization.state';
import * as _ from 'lodash';
import {getDimensionValues} from './get-dimension-values.helpers';

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
        interpretations: view.interpretations || []
      }];
    });

    visualizationDetails.filters = [...visualizationFilters];
    visualizationDetails.layouts = [...visualizationLayouts];
    visualizationDetails.interpretations = [...visualizationInterpretations];

    newVisualization.layers = [..._.map(settings.mapViews, (view: any) => {
      const newView: any = {...view};
      return {
        settings: newView,
        layout: getVisualizationLayout(view),
        filters: getVisualizationFilters(view)
      };
    })];
  } else {
    const newSettings = {...settings};
    visualizationDetails.filters = [{id: settings.id, filters: getVisualizationFilters(settings)}];
    visualizationDetails.layouts = [{id: settings.id, layout: getVisualizationLayout(settings)}];
    visualizationDetails.interpretations = [{id: settings.id, interpretations: settings.interpretations || []}];

    newVisualization.layers = [{
      settings: newSettings,
      layout: getVisualizationLayout(newSettings),
      filters: getVisualizationFilters(newSettings)
    }];
  }


  visualizationDetails.metadataIdentifiers = newVisualization.layers.map(visualizationLayer =>
    _.find(visualizationLayer.filters, ['name', 'dx']))
    .filter(dxObject => dxObject)
    .map(dxObject => dxObject.value.split('.')[0])
    .filter(dxValue => dxValue !== '')
    .join(';')
    .split(';')
    .filter(value => value !== '');

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
