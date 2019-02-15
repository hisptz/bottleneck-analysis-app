//Example of function implementation
parameters.progress(50);
$.ajax({
  url:
    '../../../api/analytics.json?dimension=dx:' +
    parameters.rule.json.data +
    '&dimension=pe:' +
    parameters.pe +
    '&dimension=ou:' +
    parameters.ou,
  type: 'GET',
  success: function(analyticsResults) {
    var dataIndex = findIndex(analyticsResults.headers, 'value');

    parameters.success({
      ...analyticsResults,
      rows: getRowsWithLimitApplied(analyticsResults.rows, dataIndex)
    });
  },
  error: function(error) {
    parameters.error(error);
  }
});

function findIndex(headers, itemName) {
  var valueObject = (headers || []).filter(
    header => header && header.name === itemName
  )[0];
  return headers.indexOf(valueObject);
}

function getRowsWithLimitApplied(rows, dataIndex) {
  return (rows || []).map(row => {
    if (!row) {
      return null;
    }
    var rowValue = parseFloat(row[dataIndex]);
    row[dataIndex] = rowValue > 99 ? '99' : rowValue.toString();
    return row;
  });
}
