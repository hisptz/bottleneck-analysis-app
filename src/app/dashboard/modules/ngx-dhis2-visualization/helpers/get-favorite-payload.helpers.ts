import * as _ from 'lodash';
import { VisualizationDataSelection } from '../models/visualization-data-selection.model';
export function getFavoritePayload(
  name: string,
  dataSelections: VisualizationDataSelection[],
  favoriteType: string
) {
  if (dataSelections.length === 0) {
    return null;
  }
  const groupedDataSelections = _.groupBy(dataSelections, 'layout');
  console.log(groupedDataSelections);
  switch (favoriteType) {
    case 'TABLE': {
      return {
        url: 'reportTables',
        favoriteType: 'REPORT_TABLE',
        favorite: {
          columns: groupedDataSelections['columns'],
          rows: groupedDataSelections['rows'],
          filters: groupedDataSelections['filters'],
          name: name,
          description: '',
          showDimensionLabels: true,
          hideEmptyRows: false,
          hideEmptyColumns: false,
          stickyColumnDimension: false,
          stickyRowDimension: false,
          skipRounding: false,
          aggregationType: 'DEFAULT',
          numberType: 'VALUE',
          measureCriteria: '',
          dataApprovalLevel: {
            id: 'DEFAULT'
          },
          showHierarchy: false,
          completedOnly: false,
          displayDensity: 'NORMAL',
          fontSize: 'NORMAL',
          digitGroupSeparator: 'SPACE',
          legendSet: null,
          legendDisplayStyle: 'FILL',
          legendDisplayStrategy: 'FIXED',
          regression: false,
          cumulative: false,
          sortOrder: 0,
          topLimit: 0,
          rowTotals: false,
          colTotals: false,
          rowSubTotals: false,
          colSubTotals: false,
          reportParams: {
            paramReportingPeriod: false,
            paramOrganisationUnit: false,
            paramParentOrganisationUnit: false
          }
        }
      };
    }

    case 'CHART': {
      return {
        url: 'charts',
        favoriteType: 'CHART',
        favorite: {
          columns: [
            {
              dimension: 'dx',
              items: [
                {
                  id: 'fbfJHSPpUQD'
                }
              ]
            }
          ],
          rows: [
            {
              dimension: 'pe',
              items: [
                {
                  id: 'LAST_12_MONTHS'
                }
              ]
            }
          ],
          filters: [
            {
              dimension: 'ou',
              items: [
                {
                  id: 'ImspTQPwCqd'
                }
              ]
            }
          ],
          name: 'New favorite chart',
          title: null,
          description: '',
          prototype: {},
          type: 'COLUMN',
          percentStackedValues: false,
          cumulativeValues: false,
          hideEmptyRowItems: 'NONE',
          regressionType: 'NONE',
          completedOnly: false,
          targetLineValue: null,
          baseLineValue: null,
          sortOrder: 0,
          aggregationType: 'DEFAULT',
          rangeAxisMaxValue: null,
          rangeAxisMinValue: null,
          rangeAxisSteps: null,
          rangeAxisDecimals: null,
          noSpaceBetweenColumns: false,
          hideLegend: false,
          hideTitle: false,
          hideSubtitle: false,
          subtitle: null,
          reportParams: {},
          showData: true,
          targetLineLabel: null,
          baseLineLabel: null,
          domainAxisLabel: null,
          rangeAxisLabel: null
        }
      };
    }
  }
}
