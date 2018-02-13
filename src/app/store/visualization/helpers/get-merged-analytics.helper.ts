import * as _ from 'lodash';

export function getMergedAnalytics(splitedAnalyticsArray: any[]) {
  let mergedRows: any[] = [];
  let headers: any[] = [];
  const metadataNames: any = {};
  const metadata: any = {};
  if (splitedAnalyticsArray) {
    splitedAnalyticsArray.forEach((analyticsObject: any) => {
      if (analyticsObject) {
        const metadataKeys = _.keys(analyticsObject.metaData);
        metadataKeys.forEach(metadataKey => {
          const metadataKeyValues = analyticsObject.metaData[metadataKey];
          if (metadataKey === 'names') {
            const metadataNamesKeys = _.keys(metadataKeyValues);
            metadataNamesKeys.forEach(metadataNameKey => {
              metadataNames[metadataNameKey] = analyticsObject.metaData.names[metadataNameKey];
            });
          } else {
            const metadataIds = analyticsObject.metaData[metadataKey];
            if (metadataIds.length > 0) {
              metadataIds.forEach(metadataId => {
                if (metadata[metadataKey]) {
                  const metadataIdIndex = _.indexOf(metadata[metadataKey], metadataId);
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
        mergedRows = [...mergedRows, ...analyticsObject.rows];
        headers = analyticsObject.headers;
      }
    });
  }

  metadata.names = metadataNames;
  return {
    headers: headers,
    metaData: metadata,
    rows: mergedRows
  };
}
