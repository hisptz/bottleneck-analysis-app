import * as _ from 'lodash';
export function getTableRowsOrColumnsArray(
  dataItemsArray: any,
  dimension: string
) {
  let flatDataItemsArray = [];
  _.each(_.range(dataItemsArray.length), (dataItemArrayIndex: number) => {
    if (flatDataItemsArray.length === 0) {
      if (dimension === 'row') {
        _.each(dataItemsArray[dataItemArrayIndex], (rowsItem: any) => {
          flatDataItemsArray = [
            ...flatDataItemsArray,
            [{ ...rowsItem, column: 0, path: rowsItem.id }]
          ];
        });
      } else {
        flatDataItemsArray = [
          ...flatDataItemsArray,
          _.map(dataItemsArray[dataItemArrayIndex], (dataItem: any) => {
            return {
              ...dataItem,
              path: dataItem.id,
              textCenter: true,
              colSpan: _.reduce(
                _.map(
                  _.slice(dataItemsArray, dataItemArrayIndex + 1),
                  (slicedDataItemsArray: any[]) => slicedDataItemsArray.length
                ),
                (product: number, count: number) => product * count
              )
            };
          })
        ];
      }
    } else {
      let innerFlatDataItemsArray = [];
      _.each(flatDataItemsArray, (flatDataItems: any[]) => {
        const path = _.join(
          _.map(flatDataItems, (dataItemObject: any) => dataItemObject.id),
          '/'
        );
        if (dimension === 'row') {
          _.each(
            dataItemsArray[dataItemArrayIndex],
            (dataItem: any, dataItemIndex: number) => {
              if (dataItemIndex === 0) {
                innerFlatDataItemsArray = [
                  ...innerFlatDataItemsArray,
                  [
                    ..._.map(flatDataItems, (flatDataItem: any) => {
                      const span = _.reduce(
                        _.map(
                          _.slice(
                            dataItemsArray,
                            flatDataItem.column + 1,
                            dataItemArrayIndex + 1
                          ),
                          (itemArray: any[]) => itemArray.length
                        ),
                        (product: number, count: number) => product * count
                      );
                      return {
                        ...flatDataItem,
                        path: flatDataItem.path ? flatDataItem.path : path,
                        [dimension === 'row' ? 'rowSpan' : 'colSpan']: span
                      };
                    }),
                    {
                      ...dataItem,
                      path: `${path}/${dataItem.id}`,
                      column: dataItemArrayIndex
                    }
                  ]
                ];
              } else {
                innerFlatDataItemsArray = [
                  ...innerFlatDataItemsArray,
                  [
                    {
                      ...dataItem,
                      path: `${path}/${dataItem.id}`,
                      column: dataItemArrayIndex
                    }
                  ]
                ];
              }
            }
          );
        }
      });

      if (dimension === 'column') {
        const flatDataItems = _.last(flatDataItemsArray);

        innerFlatDataItemsArray = [
          ...flatDataItemsArray,
          _.flatten(
            _.map(
              _.range(flatDataItems.length),
              (flatDataItemCount: number) => {
                const previousPath = flatDataItems[flatDataItemCount].path;
                return _.map(
                  dataItemsArray[dataItemArrayIndex],
                  (dataItem: any) => {
                    const path = `${previousPath}/${dataItem.id}`;

                    return {
                      ...dataItem,
                      path,
                      dataRowIds: path.split('/'),
                      textCenter: true,
                      colSpan: _.reduce(
                        _.map(
                          _.slice(dataItemsArray, dataItemArrayIndex + 1),
                          (slicedDataItemsArray: any[]) =>
                            slicedDataItemsArray.length
                        ),
                        (product: number, count: number) => product * count
                      )
                    };
                  }
                );
              }
            )
          )
        ];
      }
      flatDataItemsArray = innerFlatDataItemsArray;
    }
  });

  return flatDataItemsArray;
}
