// Javascript Code to create a Leaflet-based earthquake map. The code uses D3 to request and store data, and creates Leaflet map layers...

// Store the USGS geojson earthquake data in the "queryUrl" variable
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson"

// Using D3, perform a request to the USGS earthquake data
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});