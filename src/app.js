const { getMapboxData } = require("../services/mapbox.js");
const { getWeatherByAddress } = require("../services/forecast.js");
const path = require("path");
const express = require("express");
const hbs = require("hbs");
require('dotenv').config();

function main() {
  if (process.argv.length === 2) return console.log("Provide an address");

  getMapboxData(process.argv[2], (error, { latitude, longitude, location }) => {
    if (error) return console.log(error);

    getWeatherByAddress({ latitude, longitude }, (error, forecastData) => {
      if (error) return console.log(error);
      console.log(location);
      console.log(forecastData);
    });
  });
}

const port = process.env.PORT || 8080;
const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates/views"));
hbs.registerPartials(path.join(__dirname, "../templates/partials"));

app.use(express.static(path.resolve(__dirname, "../public")));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Handehoch",
    GOOGLE_API: process.env.GOOGLE_API
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    helpInfo: "Some helpful info about service",
    name: "Handehoch",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Handehoch",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      responseCode: 101,
      error: "You must provide an Address",
    });
  }

  getMapboxData(req.query.address, (error, { latitude, longitude, location } = {}) => {
      if (error) return res.send({error});

      getWeatherByAddress({ latitude, longitude }, (error, forecastData) => {
        if (error) return console.log(error);

        res.send({
          address: req.query.address,
          location,
          forecast: forecastData,
          latitude,
          longitude
        });
      });
    });
});

app.get("/help/*", (req, res) => {
  res.render("404page", {
    title: "404",
    name: "Handehoch",
    errorMessage: "No such help article",
  });
});

app.get("*", (req, res) => {
  res.render("404page", {
    title: "404",
    name: "Handehoch",
    errorMessage: "Page not found",
  });
});

app.listen(port, () => {
  console.log(`Server is started on port ${port}`);
});
