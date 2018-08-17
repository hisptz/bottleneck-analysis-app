import * as _ from 'lodash';

export function getMergedAnalytics(splitedAnalyticsArray: any[]) {
  /**
   * Check if analytics array is supplied and return null if not
   */
  if (!splitedAnalyticsArray) {
    return null;
  }

  /**
   * Check if analytics layer has only one item and return analytics item
   */
  if (splitedAnalyticsArray && splitedAnalyticsArray.length < 2) {
    return splitedAnalyticsArray[0] || null;
  }

  /**
   * Get headers
   */
  const headers = _.map(splitedAnalyticsArray, analyticsObject => {
    return {
      headersLength: analyticsObject.headers.length,
      headers: analyticsObject.headers
    };
  }).sort((a, b) => b.headersLength - a.headersLength)[0].headers;

  /**
   * Get metadata information and rows
   */
  const metadataNames: any = {};
  const metadata: any = {};
  let mergedRows: any[] = [];
  _.each(splitedAnalyticsArray, (analyticsObject: any) => {
    if (analyticsObject) {
      const metadataKeys = _.keys(analyticsObject.metaData);
      _.each(metadataKeys, metadataKey => {
        const metadataKeyValues = analyticsObject.metaData[metadataKey];
        if (metadataKey === 'names') {
          const metadataNamesKeys = _.keys(metadataKeyValues);
          _.each(metadataNamesKeys, metadataNameKey => {
            metadataNames[metadataNameKey] =
              analyticsObject.metaData.names[metadataNameKey];
          });
        } else {
          const metadataIds = analyticsObject.metaData[metadataKey];
          if (metadataIds.length > 0) {
            _.each(metadataIds, metadataId => {
              if (metadata[metadataKey]) {
                const metadataIdIndex = _.indexOf(
                  metadata[metadataKey],
                  metadataId
                );
                if (metadataIdIndex === -1) {
                  metadata[metadataKey].push(metadataId);
                }
              } else {
                metadata[metadataKey] = [];
                metadata[metadataKey].push(metadataId);
              }
            });
          } else {
            metadata[metadataKey] = [];
          }
        }
      });

      /**
       * Get rows
       */
      const rows = _.map(analyticsObject.rows, row => {
        const rowObject = {};
        _.each(analyticsObject.headers, (header, headerIndex) => {
          rowObject[header.name] = row[headerIndex];
        });

        return _.map(headers, header => rowObject[header.name] || '');
      });

      mergedRows = [...mergedRows, ...rows];
    }
  });

  metadata.names = metadataNames;
  return {
    headers: headers,
    metaData: metadata,
    rows: mergedRows
  };
}
