import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { Dashboard } from '../models';

@Pipe({
  name: 'sortByBookmark'
})
export class SortByBookmarkPipe implements PipeTransform {
  transform(dashboards: Dashboard[]): any {
    const bookmarkedDashboards = _.filter(
      dashboards || [],
      dashboard => dashboard.bookmarked
    );
    const unBookmarkedDashboards = _.filter(
      dashboards || [],
      dashboard => !dashboard.bookmarked
    );
    return [...bookmarkedDashboards, ...unBookmarkedDashboards];
  }
}
