import { Pipe, PipeTransform } from '@angular/core';
import { VisualizationDataSelection } from '../modules/ngx-dhis2-visualization/models';

@Pipe({
  name: 'hasRootCauseData'
})
export class HasRootCauseDataPipe implements PipeTransform {
  transform(
    dashboardId: any,
    dataSelections: VisualizationDataSelection[],
    rootCauseDataIds
  ): any {
    return null;
  }
}
