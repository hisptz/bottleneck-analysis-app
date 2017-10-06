import * as _ from 'lodash';
import {addArrayItem} from '../../utilities/addArrayItem';
export function mapStateToDashboardObject(dashboardData: any, action = null) {
  switch (action) {
    case 'create': {
      return {
        id: '0',
        details: {
          isNew: true,
          creationComplete: false,
          showName: false
        },
        name: dashboardData.name,
        dashboardItems: []
      }
    }

    case 'created': {
      return {
        id: dashboardData.id,
        details: {
          isNew: true,
          creationComplete: true,
          showIcon: true,
          showName: true
        },
        name: dashboardData.name,
        dashboardItems:  _.assign([], dashboardData.dashboardItems)
      }
    }

    case 'update': {
      return {
        id: dashboardData.id,
        details: {
          edited: true,
          editComplete: false,
          showName: false
        },
        name: dashboardData.name,
        dashboardItems:  _.assign([], dashboardData.dashboardItems)
      }
    }

    case 'updated': {
      return {
        id: dashboardData.id,
        details: {
          edited: true,
          editComplete: true,
          showIcon: true,
          editFailed: dashboardData.details.editFailed ? dashboardData.details.editFailed : false,
          error: dashboardData.details.error,
          showName: true
        },
        name: dashboardData.name,
        dashboardItems:  _.assign([], dashboardData.dashboardItems)
      }
    }

    case 'delete': {
      return {
        id: dashboardData.id,
        details: {
          toDelete: true,
          showName: false
        },
        name: dashboardData.name,
        dashboardItems: _.assign([], dashboardData.dashboardItems)
      }
    }

    default: {
      const newDashboardData = _.clone(dashboardData);
      newDashboardData.details = {
        showName: true
      };
      newDashboardData.dashboardItems = _.assign([], handleDuplicateInDashboardItems(dashboardData.dashboardItems));
      return newDashboardData;
    }
  }

}

function handleDuplicateInDashboardItems(dashboardItems) {
  const newDashboardItems: any[] = _.clone(dashboardItems);

  /**
   * Remove duplicate items
   * @type {any[]}
   */
  const duplicateFreeDashboardItems = removeDuplicateItems(newDashboardItems);

  /**
   * Return merged items
   */
  return mergeRelatedItems(duplicateFreeDashboardItems);
}

function removeDuplicateItems(dashboardItems) {
  const newDashboardItems = _.clone(dashboardItems);
  let mergedDashboardItems: any[] = [];

  newDashboardItems.forEach(dashboardItem => {
    const dashboardTypeObject = dashboardItem[_.camelCase(dashboardItem.type)];
    if (dashboardTypeObject) {
      if (mergedDashboardItems.length === 0) {
        // mergedDashboardItems.push(dashboardItem);
        mergedDashboardItems = _.assign([], addArrayItem(mergedDashboardItems, dashboardItem, 'id'))
      } else {
        const relatedItems = mergedDashboardItems.filter(item => { return item.type === dashboardItem.type});
        if (relatedItems.length === 0) {
          // mergedDashboardItems.push(dashboardItem);
          mergedDashboardItems = _.assign([], addArrayItem(mergedDashboardItems, dashboardItem, 'id'))
        } else {
          if (!checkItemAvailability(relatedItems, dashboardItem.type, dashboardTypeObject)) {
            // mergedDashboardItems.push(dashboardItem);
            mergedDashboardItems = _.assign([], addArrayItem(mergedDashboardItems, dashboardItem, 'id'))
          }
        }
      }
    }

    /**
     * Deal with other non visualizable dashboard items
     */
    if (dashboardItem.type === 'APP' || dashboardItem.type === 'MESSAGES') {
      mergedDashboardItems.push(dashboardItem);
    }
  });
  return mergedDashboardItems;
}

export function mergeRelatedItems(dashboardItems) {
  const newDashboardItems = _.clone(dashboardItems);
  const mergedItems: any[] = [];
  const mergableItems = dashboardItems.filter(item => { return item.type[item.type.length - 1] === 'S'});
  newDashboardItems.forEach((dashboardItem: any) => {
    const currentMergableItems = _.filter(mergableItems, ['type', dashboardItem.type]);

    if (currentMergableItems.length > 0) {
      if (!_.find(mergedItems, ['type', dashboardItem.type])) {

        let newItem = null;
        currentMergableItems.forEach((itemObject: any, itemIndex: number) => {

          if (newItem === null) {
            newItem = _.clone(itemObject);
          } else {
            if (itemIndex === 1) {
              newItem.id = itemObject.id;
            }

            newItem[_.camelCase(newItem.type)] = _.assign([], mergeTypeItems(
              itemObject[_.camelCase(itemObject.type)],
              newItem[_.camelCase(newItem.type)]
            ));
          }
        });

        if (newItem !== null) {
          mergedItems.push(newItem)
        }
      }
    } else {
      mergedItems.push(dashboardItem)
    }
  });

  return mergedItems;
}

function mergeTypeItems(currentItemArray, newItemArray) {
  const mergedTypeItems: any[] = [];

  /**
   * Take the current items first
   */
  currentItemArray.forEach(currentItem => {
    const availableItem = _.find(mergedTypeItems, ['id', currentItem.id]);
    if (!availableItem) {
      mergedTypeItems.push(currentItem);
    }
  });

  /**
   * Take new items also
   */
  newItemArray.forEach(newItem => {
    const availableItem = _.find(mergedTypeItems, ['id', newItem.id]);
    if (!availableItem) {
      mergedTypeItems.push(newItem);
    }
  });

  /**
   * Return the merged list
   */
  return mergedTypeItems;
}

function checkItemAvailability(relatedItems, itemType, itemTypeObject) {
  let itemAvailable = false;
  relatedItems.forEach(item => {
    const relatedItemTypeObject = item[_.camelCase(itemType)];
    if (relatedItemTypeObject) {
      if (relatedItemTypeObject.id && relatedItemTypeObject.id === itemTypeObject.id) {
        itemAvailable = true;
      }
    }
  });
  return itemAvailable;
}
