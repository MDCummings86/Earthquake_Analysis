// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// Create markers where size is proportional to magnitude and color correlated with depth
function createMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color:"#000",
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 1
    });
}


function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

   // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
};

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}

// Create a control for our layers, and add our overlays to it.
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(map);

// Create a legend to display information about our map.
let info = L.control({
    position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend".
info.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    return div;
  };
  // Add the info legend to the map.
  info.addTo(map)

  function createFeatures(earthquakeData) {

  // Create circle markers bound to lat and long with opacity so they can be seen on top of one another
  function onEachFeature(features, layer){
    layer.bindPopup(`<h3>${features.properties.place}</h3><hr><p>${new Date(features.properties.time)}</p><h3>Mag: ${features.properties.mag}</h3>`);};

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(features, latlng) {
        var depth = features.geometry.coordinates[2];
        var circleMarkerOptions = {
            radius: features.properties.mag*5,
            weight: 1,
            fillColor: markerColor(depth),
            opacity: 0.1,
          	fillOpacity: 0.8
        };
        return L.circleMarker(latlng, circleMarkerOptions);
    }
    });
  createMap(earthquakes);
};
  
// Create a function with conditionals for marker color based on depth
function markerColor(depth) {
    let color = ""
    if (depth <= 10) {
        return color = "yellow"
    }
    else if (depth <= 30) {
        return color = "yellowgreen"
    }
    else if (depth <= 50) {
        return color = "green"
    }
    else if (depth <= 70) {
        return color = "bluegreen"
    }
    else {
        return color = "blue"
    }
}; 

// // Create a legend to display information about our map.
// let info = L.control({
//   position: "bottomright"
// });

// // When the layer control is added, insert a div with the class of "legend".
// info.onAdd = function() {
//   let div = L.DomUtil.create("div", "legend");
//   return div;
// };
// // Add the info legend to the map.
// info.addTo(map)

// - https://gis.stackexchange.com/questions/193161/add-legend-to-leaflet-map
let legend = L.control({position: 'bottomleft'});
legend.onAdd = function () {

let div = L.DomUtil.create('div', 'info legend');
categories = ['-10-10','10-30','30-50','50-70','Other'];

for (var i = 0; i < categories.length; i++) {

        div.innerHTML += 
        labels.push(
            '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
        (categories[i] ? categories[i] : '+'));

    }
    div.innerHTML = labels.join('<br>');
return div;
};
legend.addTo(map);


