const locations = JSON.parse(document.getElementById('map').dataset.locations);
mapboxgl.accessToken =
  'pk.eyJ1IjoibWFrczk2IiwiYSI6ImNrc2l3eXZqcjA3bmEyd3FveGdkY2Y3MjEifQ.i97LYOFssVHEZg5sChka9A';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/maks96/cksiy9izy386h17s3woyjm444',
  scrollZoom: false,
  // center: ['36.232845', '49.988358'],
  // zoom: 10,
  // interactive: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create a marker

  const el = document.createElement('div');
  el.classList.add('marker');

  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  new mapboxgl.Popup({
    offset: 30,
  })
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Extend map bounds
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 200,
    left: 100,
    right: 100,
  },
});
