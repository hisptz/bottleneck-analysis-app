import * as _ from 'lodash';
import { getSanitizedAnalyticsMetadata } from './standardize-incoming-analytics.helper';

export function getSanitizedAnalytics(analyticsObject: any, visualizationFilters: any[]) {
  // TODO deal with analytics with more than one dynamic dimensions
  let newAnalyticsObject: any = {...analyticsObject};
  if (analyticsObject !== null) {
    const newMetadata: any = {...getSanitizedAnalyticsMetadata(analyticsObject.metaData, true)};

    if (analyticsObject.headers) {
      const headersWithOptionSet = _.filter(analyticsObject.headers, analyticsHeader => analyticsHeader.optionSet);

      /**
       * Check header with option set
       */
      _.each(headersWithOptionSet, header => {
        const headerOptionsObject = _.find(visualizationFilters, ['name', header.name]);

        if (headerOptionsObject) {
          const headerOptions = _.assign([], headerOptionsObject.options);
          if (headerOptions) {
            /**
             * Update metadata dimension
             */
            if (newMetadata[header.name]) {
              newMetadata[header.name] = _.assign(
                [],
                _.map(headerOptions, (option: any) => (option.code ? option.code : option.id))
              );
            }

            /**
             * Update metadata names
             */
            const newMetadataNames = _.clone(newMetadata.names);

            headerOptions.forEach((option: any) => {
              const nameIndex = option.code ? option.code : option.id;

              if (nameIndex) {
                newMetadataNames[nameIndex] = option.name;
              }
            });

            newMetadata.names = _.assign({}, newMetadataNames);
          }
        }
      });

      const headersWithDynamicDimensionButNotOptionSet = _.filter(analyticsObject.headers, (analyticsHeader: any) => {
        return (
          analyticsHeader.name !== 'dx' &&
          analyticsHeader.name !== 'pe' &&
          analyticsHeader.name !== 'ou' &&
          analyticsHeader.name !== 'value' &&
          !analyticsHeader.optionSet
        );
      });

      _.each(headersWithDynamicDimensionButNotOptionSet, header => {
        const headerOptionsWithoutOptionSetObject = _.find(visualizationFilters, [
          'name',
          header.name
        ]);

        if (headerOptionsWithoutOptionSetObject) {
          const headerFilter = headerOptionsWithoutOptionSetObject.value;

          if (headerFilter) {
            let headerOptions = [];
            const splittedFilter = headerFilter.split(':');

            if (splittedFilter.length > 1) {
              // find index for the dimension
              const dataSelectionHeaderIndex = analyticsObject.headers.indexOf(
                _.find(analyticsObject.headers, ['name', headerOptionsWithoutOptionSetObject.name]));
              const rowValues = dataSelectionHeaderIndex !== -1 ?
                _.filter(_.map(analyticsObject.rows, row => parseInt(row[dataSelectionHeaderIndex], 10)),
                  rowValue => !isNaN(rowValue)) : [];
              headerOptions = getFilterOptions(splittedFilter[0], parseInt(splittedFilter[1], 10), _.max(rowValues));
            } else {
              if (headerOptionsWithoutOptionSetObject.items) {
                headerOptions = _.map(headerOptionsWithoutOptionSetObject.items, (item: any) => {
                  return {
                    code: item.id,
                    name: item.displayName
                  };
                });
              }
            }

            if (headerOptions) {
              /**
               * Update metadata dimension
               */
              if (newMetadata[header.name]) {
                newMetadata[header.name] = _.assign(
                  [],
                  _.map(headerOptions, (option: any) => (option.code ? option.code : option.id))
                );
              }

              /**
               * Update metadata names
               */
              const newMetadataNames = _.clone(newMetadata.names);

              headerOptions.forEach((option: any) => {
                const nameIndex = option.code ? option.code : option.id;

                if (nameIndex) {
                  newMetadataNames[nameIndex] = option.name;
                }
              });

              newMetadata.names = _.assign({}, newMetadataNames);
            }
          }
        }
      });
    }

    newAnalyticsObject.metaData = _.assign({}, newMetadata);
  }

  return newAnalyticsObject;
}

function getFilterOptions(operator: string, testValue: number, maxValue: number) {
  switch (operator) {
    case 'LT':
      return _.times(testValue, (valueItem: number) => {
        return {
          code: valueItem.toString(),
          name: valueItem.toString()
        };
      });
    case 'LE':
      return _.times(testValue + 1, (valueItem: number) => {
        return {
          code: valueItem.toString(),
          name: valueItem.toString()
        };
      });
    case 'GT':
      return _.map(_.range(testValue + 1, maxValue + 1), valueItem => {
        return {
          code: valueItem.toString(),
          name: valueItem.toString()
        };
      });
    case 'GE':
      return _.map(_.range(testValue, maxValue + 1), valueItem => {
        return {
          code: valueItem.toString(),
          name: valueItem.toString()
        };
      });
    case 'EQ':
      return [{code: testValue.toString(), name: testValue.toString()}];
    case 'NE':
      return _.filter(_.times(maxValue + 1, (valueItem: number) => {
        return {
          code: valueItem.toString(),
          name: valueItem.toString()
        };
      }), valueItem => parseInt(valueItem.code, 10) !== testValue);
    default:
      return [];
  }
}

function getFilterNumberRange(filterString) {
  // todo add more mechanism for other operations
  const splitedFilter = filterString.split(':');
  let newNumberRange = [];
  if (splitedFilter[0] === 'LE') {
    const maxValue: number = parseInt(splitedFilter[1], 10);
    if (!isNaN(maxValue)) {
      newNumberRange = _.assign(
        [],
        _.times(maxValue + 1, (value: number) => {
          return {
            code: value.toString(),
            name: value.toString()
          };
        })
      );
    }
  } else if (splitedFilter[0] === 'LT') {
    const maxValue: number = parseInt(splitedFilter[1], 10);
    if (!isNaN(maxValue)) {
      newNumberRange = _.assign(
        [],
        _.times(maxValue, (value: number) => {
          return {
            code: value.toString(),
            name: value.toString()
          };
        })
      );
    }
  } else if (splitedFilter[0] === 'EQ') {
    newNumberRange = [
      {
        code: splitedFilter[1],
        name: splitedFilter[1]
      }
    ];
  } else if (splitedFilter[0] === 'GE') {

  } else if (splitedFilter[0] === 'GT') {
  } else if (splitedFilter[0] === 'NE') {
  }
  return newNumberRange;
}
