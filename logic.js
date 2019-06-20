// Javascript Code to create a Leaflet-based earthquake map. The code uses D3 to request and add data, and creates a Leaflet map with baseMap and overlayMap layers. The base map comes from ESRI and the overlay is earthquake incidences (represented by Leaflet circle markers) using USGS earthquake data. With the earthquakes, incidences are color coded by eathquake scale and the size of the circle marker also changes based on earthquake scale.


// First create and initialize the map where the map element ('mapdiv') is
var myMap = L.map('mapdiv', {center: [37.09, -95.71], zoom: 5});
    
var streetmap = L.tileLayer.provider('Esri.WorldStreetMap', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012', maxZoom: 18});
myMap.addLayer(streetmap);

// Make a D3 call to the USGS GeoJSON data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson").then(function(data) {

  // Earthquake marker styling. The markerColor function selects a color for the marker based on the scale (magnitude) of the earthquake.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: markerColor(feature.properties.mag),
      color: "#000000",
      radius: markerRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the color of the marker based on the magnitude of the earthquake.
  function markerColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }
    
  function markerRadius(magnitude) {
    return magnitude * 3;
  }

  // Here we add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(myMap);

  // Here we create a legend control object.
  var legend = L.control({
    position: "bottomleft"
  });

  // Then add all the details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(myMap);
});