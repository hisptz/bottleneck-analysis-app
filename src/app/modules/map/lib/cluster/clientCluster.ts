import * as L from 'leaflet';

export const eventIconCreateFunction = (
  cluster,
  eventPointColor,
  opacity,
  labelFontStyle,
  labelFontSize
) => {
  const count = cluster.getChildCount();
  const iconSize = calculateClusterSize(count);
  const htmlContent = createClusterIcon(
    iconSize,
    cluster,
    eventPointColor,
    opacity,
    labelFontStyle,
    labelFontSize
  );
  return L.divIcon({
    html: htmlContent,
    className: 'leaflet-cluster-icon',
    iconSize: new L.Point(iconSize[0], iconSize[1])
  });
};

const calculateClusterSize = count => {
  return count < 10
    ? [16, 16]
    : count >= 10 && count <= 40 ? [20, 20] : count > 40 && count < 100 ? [30, 30] : [40, 40];
};

function calculateMarginTop(iconSize: any) {
  const size = iconSize[0];
  return size === 30 ? 5 : size === 20 ? 2 : 10;
}

export const getCount = count => {
  // eslint-disable-line
  let num;

  if (count >= 1000 && count < 9500) {
    num = (count / 1000).toFixed(1) + 'k'; // 3.3k
  } else if (count >= 9500 && count < 999500) {
    num = Math.round(count / 1000) + 'k'; // 33k
  } else if (count >= 999500 && count < 1950000) {
    num = (count / 1000000).toFixed(1) + 'M'; // 3.3M
  } else if (count > 1950000) {
    num = Math.round(count / 1000000) + 'M'; // 33M
  }

  return num || count;
};

function createClusterIcon(
  iconSize,
  cluster,
  eventPointColor,
  opacity,
  labelFontStyle,
  labelFontSize
) {
  const marginTop = calculateMarginTop(iconSize);
  const height = iconSize[0];
  const width = iconSize[1];
  const htmlContent =
    '<div style="' +
    'color:#ffffff;text-align:center;' +
    'box-shadow: 0 1px 4px rgba(0, 0, 0, 0.65);' +
    'opacity:' +
    opacity +
    ';' +
    'background-color:' +
    eventColor(eventPointColor) +
    ';' +
    'height:' +
    height +
    'px;width:' +
    width +
    'px;' +
    'font-style:' +
    labelFontStyle +
    ';' +
    'font-size:' +
    labelFontSize +
    ';' +
    'border-radius:' +
    iconSize[0] +
    'px;">' +
    '<span style="line-height:' +
    width +
    'px;">' +
    getCount(parseInt(cluster.getChildCount(), 10)) +
    '</span>' +
    '</div>';
  return htmlContent;
}

function eventColor(color) {
  return '#' + color;
}
