import { DEFAULT_LEGENDS } from '../constants/default-legend';
import * as _ from 'lodash';
import { Legend, LegendSet } from '../models/legend-set';

export function getLegendSetsConfiguration(selectedItems, legendSetEntities) {
  return _.map(selectedItems, selectedItem => {
    const index = _.indexOf(selectedItems, selectedItem) + 1;
    const legends =
      legendSetEntities && legendSetEntities[selectedItem.id]
        ? legendSetEntities && legendSetEntities[selectedItem.id].legends
        : [];
    const name = selectedItem.name ? selectedItem.name : 'Item ' + index;
    const { id } = selectedItem;
    return { id, name, legends };
  });
}

export function getLegendSetForUpdate(legendSets: LegendSet[]) {
  const filteredegendSets = _.filter(
    legendSets,
    (legendSet: LegendSet) => legendSet.legends.length > 0
  );
  return filteredegendSets;
}

export function getNewLegend(legends: Legend[]): Legend {
  legends = _.reverse(_.sortBy(legends, 'startValue'));
  // const startValue =
  //   legends && legends.length > 0 ? legends[0].endValue + 1 : 0;
  // const endValue = startValue + 9;
  const startValue =
    legends && legends.length > 0 ? legends[0].endValue : 0;
  const endValue = startValue + 10;
  return {
    id: getUniqueId(),
    name: 'Untitled',
    color: '#fff',
    startValue: startValue,
    endValue: endValue,
  };
}

export function getDefaultLegends() {
  return _.sortBy(
    _.map(DEFAULT_LEGENDS, legend => {
      legend.id = getUniqueId();
      return legend;
    }),
    'startValue'
  );
}

export function getUniqueId(): string {
  let uid = '';
  const possible_combinations =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 11; i++) {
    uid += possible_combinations.charAt(
      Math.floor(Math.random() * possible_combinations.length)
    );
  }
  return uid;
}
