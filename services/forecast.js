const request = require("request");
require('dotenv').config();

function getWeatherByAddress(address, callback) {
  const uri = `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_ACCESS_KEY}&query=${address.latitude},%20${address.longitude}`;

  return request(uri, { json: true }, (error, response) => {
    if (error) {
      return callback("Unable to reach weather service", undefined);
    } else if (response.body.error) {
      return callback("Unable to find location", undefined);
    }

    const { current } = response.body;
    callback(
      undefined,
      `It's ${current.temperature} degrees, but feels like ${current.feelslike} degrees.`
    );
  });
}

module.exports = {
  getWeatherByAddress,
};
