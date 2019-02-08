import * as _ from 'lodash';
export function getSanitizedChartXAxisCategories(series: any[]) {
  let newCategories: any[] = [];
  if (series) {
    const seriesDataObjects = _.map(
      series,
      (seriesObject: any) => seriesObject.data
    );

    if (seriesDataObjects) {
      const seriesCategoryNamesArray = _.map(seriesDataObjects, seriesData => {
        return _.map(seriesData, data => {
          const nameArray = data.name.split('_');
          const newCategoryArray = [];
          if (nameArray) {
            const reversedNameArray = _.reverse(nameArray);
            _.times(nameArray.length, (num: number) => {
              if (num === 0) {
                newCategoryArray.push({ name: reversedNameArray[num] });
              } else {
                const parentCategory: any = _.find(newCategoryArray, [
                  'name',
                  reversedNameArray[num - 1]
                ]);

                if (parentCategory) {
                  const parentCategoryIndex = _.findIndex(
                    newCategoryArray,
                    parentCategory
                  );
                  let newChildrenCategories: any[] = parentCategory.categories
                    ? parentCategory.categories
                    : [];
                  newChildrenCategories = _.concat(
                    newChildrenCategories,
                    reversedNameArray[num]
                  );
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
              categories: categories
            });
          }
        });

        newCategories = _.assign([], sanitizedCategoryNames);
      }
    }
  }

  return _.uniqBy(newCategories, 'name');
}
