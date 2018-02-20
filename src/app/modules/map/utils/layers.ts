import * as _ from 'lodash';

export const createEventFeature = (headers, names, layerEvent, eventCoordinateField?) => {
  const properties = layerEvent.reduce(
    (props, value, i) => ({
      ...props,
      [headers[i].name]: names[value] || value
    }),
    {}
  );

  // properties style
  properties.style = {
    color: '#fff',
    weight: 1,
    stroke: true,
    fill: true
  };

  let coordinates;

  if (eventCoordinateField) {
    // If coordinate field other than event location
    const eventCoord = properties[eventCoordinateField];

    if (Array.isArray(eventCoord)) {
      coordinates = eventCoord;
    } else if (_.isString(eventCoord) && !_.isEmpty(eventCoord)) {
      coordinates = JSON.parse(eventCoord);
    } else {
      coordinates = [];
    }
  } else {
    // Use event location
    coordinates = [properties.longitude, properties.latitude]; // Event location
  }

  return {
    type: 'Feature',
    id: properties.psi,
    properties,
    geometry: {
      type: 'Point',
      coordinates: coordinates.map(parseFloat)
    }
  };
};

export const isValidCoordinate = coord =>
  Array.isArray(coord) &&
  coord.length === 2 &&
  coord[0] >= -180 &&
  coord[0] <= 180 &&
  coord[1] >= -90 &&
  coord[1] <= 90;
