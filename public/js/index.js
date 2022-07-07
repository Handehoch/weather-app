const searchForm = document.querySelector('form');
const search = document.querySelector('input');

function getWeatherData(address, callback) {
  fetch(`/weather?address=${address}`).then((res) => {
    res.json().then(data => {
      if(data.error) {
        console.log(data.error);
        callback(data.error, undefined);
      } else {
        console.log(data.location);
        console.log(data.forecast);
        callback(undefined, data);
      }
    });
  });
}

function initMap(lat, lng) {
  const coordinates = { lat, lng};
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: coordinates,
  });

  new google.maps.Marker({
    position: coordinates,
    map,
    title: "Hello World!",
  });
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const firstMessage = document.querySelector('#message-1');
  const secondMessage = document.querySelector('#message-2');
  firstMessage.textContent = 'Loading...';
  secondMessage.textContent = '';
  getWeatherData(search.value, showForecast);
});

function showForecast(error, data) {
  const firstMessage = document.querySelector('#message-1');
  const secondMessage = document.querySelector('#message-2');

  if(error) {
    firstMessage.textContent = error;
    return;
  }

  firstMessage.textContent = data.location;
  secondMessage.textContent = data.forecast;
  initMap(data.latitude, data.longitude);
}
