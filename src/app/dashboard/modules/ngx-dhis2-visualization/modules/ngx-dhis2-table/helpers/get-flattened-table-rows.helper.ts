import * as _ from 'lodash';
export function getFlattenedTableRows(tableDataRows: any) {
  let firstDataColumns = [];
  return _.map(tableDataRows, (tableRows: any[]) => {
    firstDataColumns = [...firstDataColumns, _.first(tableRows)];
    const dataPaths = _.uniq(
      _.flatten(
        _.map(tableRows, (tableCell: any) =>
          tableCell.path ? tableCell.path.split('/') : []
        )
      )
    );

    return _.uniqBy(
      [
        ..._.filter(
          _.map(dataPaths, (dataPath: string) =>
            _.find(firstDataColumns, ['id', dataPath])
          ),
          dataCell => dataCell
        ),
        ...tableRows
      ],
      'id'
    );
  });
}
