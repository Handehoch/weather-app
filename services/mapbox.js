const request = require("request");
require('dotenv').config();

function getMapboxData(query, callback) {
  const uri = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${process.env.MAPBOX_TOKEN}`;

  request(uri, { json: true }, (error, response) => {
    if (error) {
      return callback(`Unable to reach map service`, undefined);
    } else if (response.body.features.length === 0) {
      return callback("Unable to find location", undefined);
    }

    const { center, place_name } = response.body.features[0];
    callback(undefined, {
      latitude: center[1],
      longitude: center[0],
      location: place_name,
    });
  });
}

module.exports = {
  getMapboxData,
};
