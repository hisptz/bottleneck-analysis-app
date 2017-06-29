import {ApplicationState} from '../application-state';
import * as _ from 'lodash';
export function visualizationObjectsSelector(state: ApplicationState) {
  return updateWithVisualizableObject(
    state,
    updateWithConfiguration(
      state,
      updateWithAnalytics(
        state,
        updateWithFavorite(
          state,
          _.filter(state.storeData.visualizationObjects, ['dashboardId', state.uiState.currentDashboard])
        )
      )
    )
  );

}

function updateWithFavorite(state, visualizationObjects) {
  const newVisualizationObjects = _.cloneDeep(visualizationObjects);
  newVisualizationObjects.forEach(visualizationObject => {
    if (visualizationObject.details.favorite.id) {
      const favoriteObject = _.find(state.storeData.favorites, ['id', visualizationObject.details.favorite.id]);
      if (favoriteObject) {
        visualizationObject.layers = mapFavoriteToLayerSettings(favoriteObject);
      }
    }
  });

  return newVisualizationObjects;
}

function mapFavoriteToLayerSettings(favoriteObject: any) {
  const layers: any[] = [];
  if (favoriteObject.mapViews) {
    favoriteObject.mapViews.forEach((view: any) => {
      layers.push({settings: view})
    })
  } else {
    layers.push({settings: favoriteObject})
  }
  return layers;
}

function updateWithAnalytics(state, visualizationObjects) {
  const newVisualizationObjects = _.cloneDeep(visualizationObjects);
  newVisualizationObjects.forEach(visualizationObject => {
    visualizationObject.layers.forEach(layer => {
      const analyticsObject = _.find(state.storeData.analytics, ['id', layer.settings.id]);
      if (analyticsObject) {
        visualizationObject.details.analyticsLoaded = true;
        layer.analytics = Object.assign({}, analyticsObject.analytics);
      }
    })
  });
  return newVisualizationObjects;
}

function updateWithConfiguration(state, visualizationObjects) {
  return visualizationObjects.map(visualizationObject => { return getConfiguration(state, visualizationObject)})
}

function updateWithVisualizableObject(state, visualizationObjects) {
  return visualizationObjects.map(visualizationObject => { return getVisualizableObject(state, visualizationObject)});
}

function getVisualizableObject(state, visualizationObject) {
  switch (visualizationObject.details.currentVisualization) {
    case 'CHART': {
      visualizationObject.layers = updateWithChartObject(state, visualizationObject.layers);
      if (visualizationObject.layers.filter(layer => { return layer.chartObject }).length > 0) {
        visualizationObject.details.loaded = true;
      }
      return visualizationObject;
    }
    default:
      return visualizationObject;
  }
}

function updateWithChartObject(state, visualizationLayers) {
  if (visualizationLayers) {
    visualizationLayers.forEach((layer: any) => {
      const chartObject: any = _.find(state.storeData.chartObjects, ['id', layer.settings.id]);
      if (chartObject) {
        layer.chartObject = chartObject.content;
      }
    })
  }
  return visualizationLayers;
}

function getConfiguration(state, visualizationObject) {
  switch (visualizationObject.details.currentVisualization) {
    case 'CHART': {
      visualizationObject.layers = updateWithChartConfiguration(state, visualizationObject.layers);
      return visualizationObject;
    }

    case 'TABLE': {
      return visualizationObject;
    }

    case 'MAP': {
      return visualizationObject;
    }

    default:
      return visualizationObject;
  }
}

function updateWithChartConfiguration(state, visualizationLayers) {
  if (visualizationLayers) {
    visualizationLayers.forEach((layer: any) => {
      const chartConfigurationObject = _.find(state.storeData.chartConfigurations, ['id', layer.settings.id]);
      if (chartConfigurationObject) {
        layer.settings.chartConfiguration = chartConfigurationObject.chartConfiguration;
      }
    })
  }
  return visualizationLayers;
}
