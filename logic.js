// Javascript Code to create a Leaflet-based earthquake map. The code uses D3 to request and add data, and creates a Leaflet map with baseMap and overlayMap layers. The base map comes from ESRI and the overlay is earthquake incidences (represented by Leaflet circle markers) using USGS earthquake data. With the earthquakes, incidences are color coded by eathquake scale and the size of the circle marker also changes based on earthquake scale. Finally, there is also a layer showing


// Add three map layers: World street map, world imagery, and world terrain map. The World Imagery map is a nice satellite view that will be used for the default.    
var streetmap = L.tileLayer.provider("Esri.WorldStreetMap", {maxZoom: 9, minZoom: 1});

var imagerymap = L.tileLayer.provider("Esri.WorldImagery", {maxZoom: 9, minZoom: 1})

var terrainmap = L.tileLayer.provider("Esri.WorldTerrain", {maxZoom: 9, minZoom: 1})


// Initialize the map where the map element ('mapdiv') is and add the imagerymap as the default layer.
var myMap = L.map("mapdiv", {center: [40, -100], zoom: 4, layers: [imagerymap]});

myMap.addLayer(imagerymap);


// Add all of the map layers to baseMaps
var baseMaps = {
  "Street Map": streetmap,
  "World Imagery (Satellite) Map": imagerymap,
  "Terrain Map": terrainmap
};

// Create layers for our two different sets of data, earthquakes and tectonicplates.
var earthquakes = new L.LayerGroup();
var tectonicplates = new L.LayerGroup();

// Create an overlay layer for the seismic data (earthquakes and tectonic plates. These may be turned on or off.
var overlays = {
    Earthquakes: earthquakes,
    "Tectonic Plates": tectonicplates
};

// Add a control which allows the user to choose which layers to display (there must be one map layer though!)
L.control.layers(baseMaps, overlays).addTo(myMap);

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

    // markerColor function
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
    
    // Updates the marker radius proportionate to the magnitude
    function markerRadius(magnitude) {
        return magnitude * 3;
    }

    // Earthquakes layer. Here the data is added to the earthquakes variable rather than directly to the map. Circle markers are used to represent earthquakes and are styled according to the functions above, and a popup element is added for each marker which gives information about that earthquake.
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(earthquakes);
    
    // Now add the earthquakes layer to the map
    earthquakes.addTo(myMap);

    // The last aspect relating to the earthquake data is a legend that tells the user which color is used for each magnitude. This is very similar to the example here: https://leafletjs.com/examples/choropleth/
    var legend = L.control({position: "bottomright"});

    legend.onAdd = function(map) {
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

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        
        return div;
    };

    // Have to add the legend to the map.
    legend.addTo(myMap);
    
    // Now do the same thing for the tectonic plate data. Here I have stored it in a data file, rather than accessing it externally from the web
    d3.json("data/PB2002_boundaries.json").then(function(platedata) {
        
        // Add the data to the tectonicplates layer
        L.geoJson(platedata, {color: "orange", weight: 2}).addTo(tectonicplates);

        //Then add the tectonicplates layer to the map.
        tectonicplates.addTo(myMap);
    });
});