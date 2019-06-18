// Javascript Code to create a Leaflet-based earthquake map. The code uses D3 to request and store data, and creates a Leaflet map with baseMap and overlayMap layers. The base map comes from ESRI and the overlay is earthquake incidences (represented by Leaflet circle markers) using USGS earthquake data. With the earthquakes, incidences are color coded by eathquake scale and the size of the circle marker also changes based on earthquake scale.

// Store the USGS geojson earthquake data in the queryUrl variable
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson"

/*// Using D3, perform a request to the USGS earthquake data
d3.json(queryUrl, function(data) {
  // Once we get a response, send data.features to the createFeatures function
  createFeatures(data.features);
});*/

/*function createFeatures(earthquakeData) {

  // The following function runs once for each feature, describing the earthquake incidence time and place
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Now we create a GeoJSON layer containing the earthquake data, and pass it to the createMap function 
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
}*/

function createMap() {
    
    // Initialize map
    var myMap = L.map('mapdiv', {center: [37.09, -95.71], zoom: 5});
    
    // Define streetmap
    var streetmap = L.tileLayer.provider('Esri.WorldStreetMap', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
    maxZoom: 18});
    
    // Add streetmap to map
    myMap.addLayer(streetmap);

  /*// Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };*/

  /*// Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };*/

/*  // Create our map, giving it the streetmap and earthquakes layers to display on load


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, {
    collapsed: false
  }).addTo(myMap);*/
};

createMap();