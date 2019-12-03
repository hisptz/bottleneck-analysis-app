import * as _ from 'lodash';
export function getSanitizedChartXAxisCategories(
  series: any[],
  xAxisItems: any
) {
  const reversedXAxisItems = _.reverse(xAxisItems || []);
  let newCategories: any[] = [];
  if (series) {
    const seriesDataObjects = _.map(
      series,
      (seriesObject: any) => seriesObject.data
    );

    if (seriesDataObjects) {
      const seriesCategoryNamesArray = _.map(seriesDataObjects, seriesData => {
        return _.map(seriesData, data => {
          const idArray = data.id.split('_');
          const newCategoryArray = [];
          if (idArray) {
            const reversedIdArray = _.reverse(idArray);
            _.times(idArray.length, (num: number) => {
              if (num === 0) {
                const parentCategoryItem = _.find(
                  reversedXAxisItems[num] || [],
                  ['id', reversedIdArray[num]]
                );

                newCategoryArray.push({
                  id: reversedIdArray[num],
                  name: parentCategoryItem
                    ? parentCategoryItem.label || parentCategoryItem.name
                    : reversedIdArray[num],
                });
              } else {
                const parentCategory: any = _.find(newCategoryArray, [
                  'id',
                  reversedIdArray[num - 1],
                ]);

                if (parentCategory) {
                  const parentCategoryIndex = _.findIndex(
                    newCategoryArray,
                    parentCategory
                  );
                  let newChildrenCategories: any[] = parentCategory.categories
                    ? parentCategory.categories
                    : [];
                  const childrenCategoryItem = _.find(
                    reversedXAxisItems[num] || [],
                    ['id', reversedIdArray[num]]
                  );

                  newChildrenCategories = [
                    ...newChildrenCategories,
                    childrenCategoryItem
                      ? childrenCategoryItem.label || childrenCategoryItem.name
                      : reversedIdArray[num],
                  ];

                  parentCategory.categories = _.assign(
                    [],
                    newChildrenCategories
                  );

                  newCategoryArray[parentCategoryIndex] = parentCategory;
                }
              }
            });
          }
          return newCategoryArray[0];
        });
      });

      if (seriesCategoryNamesArray) {
        const groupedCategoryNames = _.groupBy(
          seriesCategoryNamesArray[0],
          'name'
        );
        const categoryNameGroupKeys = _.map(
          seriesCategoryNamesArray[0],
          category => category.name
        );
        const sanitizedCategoryNames: any[] = [];
        _.forEach(categoryNameGroupKeys, (key: any) => {
          const categories = _.filter(
            _.map(groupedCategoryNames[key], (categoryObject: any) => {
              return categoryObject.categories
                ? categoryObject.categories[0]
                : null;
            }),
            (category: any) => category !== null
          );
          if (categories.length === 0) {
            sanitizedCategoryNames.push({ name: key });
          } else {
            sanitizedCategoryNames.push({
              name: key,
              categories: categories,
            });
          }
        });

        newCategories = _.assign([], sanitizedCategoryNames);
      }
    }
  }

  return _.uniqBy(newCategories, 'name');
}
