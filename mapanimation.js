// TODO: add your own access token
mapboxgl.accessToken = "YOUR ACCESS TOKEN HERE";

let map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-71.1218519, 42.39707221],
  zoom: 14,
});

const markers = [];

async function run() {
  const locations = await getBusLocations();
  const length = locations.length;
  console.log(new Date());
  console.log(locations);
  for (let i = 0; i < length; i++) {
    const name = locations[i].id;
    const result = checkBusID(name);
    if (result === -1) {
      const marker = new mapboxgl.Marker()
        .setLngLat([
          locations[i].attributes.longitude,
          locations[i].attributes.latitude,
        ])
        .addTo(map);
      markers.push([name, marker]);
    } else {
      markers[result][1].setLngLat([
        locations[i].attributes.longitude,
        locations[i].attributes.latitude,
      ]);
    }
  }

  //timer
  setTimeout(run, 15000);
}

function checkBusID(busID) {
  let result = -1;
  for (let i = 0; i < markers.length; i++) {
    console.log(markers[i]);
    if (markers[i][0] === busID) {
      result = i;
    }
  }
  console.log(result);
  return result;
}

async function getBusLocations() {
  const url = "https://api-v3.mbta.com/vehicles?filter[route]=96&include=trip";
  const response = await fetch(url);
  const json = await response.json();
  return json.data;
}

run();
