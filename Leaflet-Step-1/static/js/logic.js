// Create map object
var myMap = L.map("map", {
    center: [15,0],
    zoom: 3
  });
  
  // Add tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
// Use link to get the geojson data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson";

// Function to change color with magnitude
function getColor(magnitude) {
    switch (true) {
        case magnitude > 5:
            return "#2E0854";
        case magnitude > 4:
            return "#551A8B";
        case magnitude > 3:
            return "#9932CC";
        case magnitude > 2:
            return "#BF3EFF";
        case magnitude > 1:
            return "#E066FF";
        default:
            return "#FFBBFF";
        }
    };

    // function to change marker size with magnitude
    function getSize(magnitude) {
        switch (true) {
            case magnitude > 5:
                return 20;
            case magnitude > 4:
                return 16;
            case magnitude > 3:
                return 12;
            case magnitude > 2:
                return 8;
            case magnitude > 1:
                return 4;
            default:
                return 2;
            }
        };


  // Grabbing our GeoJSON data..
d3.json(link, function(data) {
    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
        // add pop ups
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h1>Magnitude " + feature.properties.mag + "</h1> <hr> <h2>Location: " + feature.properties.place + "</h2>");
        },
        // format markers
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getSize(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            });
        }
    }).addTo(myMap);

    // an object legend
    var legend = L.control({
        position: "bottomright"
      });
    
      // details for the legend
      legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "info legend");

        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
            "#FFBBFF",
            "#E066FF",
            "#BF3EFF",
            "#9932CC",
            "#551A8B",
            "#2E0854"
        ];
        div.innerHTML += '<b>Magnitude</b><br>'
        // Looping through
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<div style='width: 20px; height: 16px; float:left; margin-right:4px; margin-bottom: 2px; background: " + colors[i] + "'></div>" +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
            }

            
        return div;
        
      };
    
      // Add legend to the map.
      legend.addTo(myMap);
});