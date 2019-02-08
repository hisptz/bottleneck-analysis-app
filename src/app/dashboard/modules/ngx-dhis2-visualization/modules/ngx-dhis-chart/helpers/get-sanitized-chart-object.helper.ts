import * as _ from 'lodash';
import { ChartConfiguration } from '../models';
export function getSanitizedChartObject(
  chartObject: any,
  chartConfiguration: ChartConfiguration
) {
  const dataSelectionGroups = _.flatten(
    _.filter(
      _.map(chartConfiguration.dataSelections || [], (dataSelection: any) => {
        return dataSelection.groups;
      }),
      group => group
    )
  );

  const dataSelectionGroupMembers = _.flatten(
    _.map(dataSelectionGroups, group => {
      return _.map(group.members, (member: any) => `${member.id}_${group.id}`);
    })
  );

  // Remove non numeric series data and their categories
  const dataIndexesArrayToRemove = _.map(chartObject.series, seriesObject => {
    return _.filter(
      _.map(seriesObject.data, (dataItem: any, dataIndex: number) =>
        dataItem.y === '' ||
        (dataSelectionGroupMembers.length > 0 &&
          dataSelectionGroupMembers.indexOf(dataItem.id) === -1)
          ? dataIndex
          : -1
      ),
      (dataIndex: number) => dataIndex !== -1
    );
  });

  let newDataIndexes = [];
  _.each(dataIndexesArrayToRemove, (dataIndexes: number[]) => {
    newDataIndexes = newDataIndexes.length === 0 ? dataIndexes : newDataIndexes;
    newDataIndexes = _.intersection(newDataIndexes, dataIndexes);
  });

  const newSeries = _.map(chartObject.series, (seriesObject: any) => {
    return {
      ...seriesObject,
      data: _.filter(
        _.map(seriesObject.data, (dataItem: any) => {
          const splitedDataItemId = dataItem.id.split('_');

          const associatedGroup = _.find(dataSelectionGroups, [
            'id',
            splitedDataItemId[1]
          ]);

          return associatedGroup &&
            _.some(
              associatedGroup.members,
              (member: any) => member.id === splitedDataItemId[0]
            ) &&
            associatedGroup.color
            ? { ...dataItem, color: associatedGroup.color }
            : dataItem;
        }),
        (dataItem: any, dataIndex: number) =>
          newDataIndexes.indexOf(dataIndex) === -1
      )
    };
  });

  let categoryCount = 0;
  const newCategories = _.map(chartObject.xAxis.categories, (category: any) => {
    if (!category.categories) {
      return category;
    }
    const newCategory = {
      ...category,
      categories: _.filter(
        category.categories,
        (innerCategory: any, innerCategoryIndex: number) =>
          newDataIndexes.indexOf(innerCategoryIndex + categoryCount) === -1
      )
    };

    categoryCount += category.categories ? category.categories.length : 0;
    return newCategory;
  });

  return {
    ...chartObject,
    series: newSeries,
    xAxis: { ...chartObject.xAxis, categories: newCategories }
  };
}
