
var os_map = '<a href="http://openstreetmap.org">OpenStreetMap</a>',
    ot_map = '<a href="http://opentopomap.org/">OpenTopoMap</a>';

var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; ' + os_map + ' Contributors',
    otmUrl = 'http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    otmAttrib = '&copy; ' + ot_map + ' Contributors';

var osmMap = L.tileLayer(osmUrl, { attribution: osmAttrib }),
    otmMap = L.tileLayer(otmUrl, { attribution: otmAttrib });

// Opsionet për hartën (qendra: gjerësi gjeografike, gjatësi gjeografike dhe shkalla e zoom)
var mapOptions = {
    layers: [osmMap],
    center: [41.0, 19.818],
    zoom: 8
}
var map = new L.map('map', mapOptions); // Creating a map object 

var baseLayers = {
    "Open Street Map": osmMap,
    "Topography": otmMap
};

// Creating a Layer object
var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layer);      // Adding layer to the map

var circleCenter = new Array(earthQuakePoints.length);
var magn;
var layerGroups = {};
for (var i = 0; i < earthQuakePoints.length; ++i) {
    layerGroups[i] = L.layerGroup().addTo(map);
}
var latestQuake = L.layerGroup().addTo(map);
var lGbigTermet = L.layerGroup()//.addTo(map);     // Magnitude >4
var lGsmallTermet = L.layerGroup()//.addTo(map);   // Magnitude <3
var lGaverageTermet = L.layerGroup()//.addTo(map); // Magnitude 3-4
for (var i = 0; i < earthQuakePoints.length; i++) {
    circleCenter = [earthQuakePoints[i][4], earthQuakePoints[i][5]];
    magn = 3 * earthQuakePoints[i][2];
    earthQuakePoints[i][2] > 4 ? ngjyra = "red" : earthQuakePoints[i][2] < 3 ? ngjyra = "blue" : ngjyra = "yellow";
    //earthQuakePoints[i][2] > 4 ? z = 10000000000 : earthQuakePoints[i][2] < 3 ? z = 50 : z = 500;
    //var circle = L.circle(circleCenter, magn, { color: 'blue', weight: 2, fillColor: '#f03', fillOpacity: 0.4 });
    var circle = new L.circleMarker(circleCenter, { radius: magn, stroke: true, color: "blue", opacity: 0.3, weight: 1, fill: true, fillColor: ngjyra, fillOpacity: 0.3 });
    circle.bindPopup("Magnituda: " + earthQuakePoints[i][2].toString() + "<br>" + "Thell&euml;sia: " + earthQuakePoints[i][6].toString() + " km" + "<br>" + "Data: " + earthQuakePoints[i][0] + "<br>" + earthQuakePoints[i][3]);
    if (i < 20) {
        latestQuake.addLayer(circle);
    }
    if (earthQuakePoints[i][2] > 4) {
        lGbigTermet.addLayer(circle);
    } else if (earthQuakePoints[i][2] < 3) {
        lGsmallTermet.addLayer(circle);
    } else {
        lGaverageTermet.addLayer(circle);
    }
}

var tektonOptions = { color: 'red', weight: 2, opacity: 1.0 };
var tektorrOptions = { color: 'blue', weight: 2, opacity: 0.9 };
var shOptions = { color: 'blue', weight: 2, opacity: 1.0, fillColor: 'blue', fillOpacity: 0.9 };
var pOptions = { color: 'blue', weight: 2, opacity: 1.0, fillColor: 'lightblue', fillOpacity: 0.9 };
var trOptions = { color: 'red', weight: 2, opacity: 1.0, fillColor: 'red', fillOpacity: 0.95 };

var lGTectonics = L.layerGroup()//.addTo(map);

var polytekton = new L.Polyline(alltekton, tektonOptions);
lGTectonics.addLayer(polytekton);

var polytekBlue = new L.Polyline(alltektonBlue, tektorrOptions);
lGTectonics.addLayer(polytekBlue);

var polyallsh = new L.Polygon(allsh, shOptions);
lGTectonics.addLayer(polyallsh);

var polyallp = new L.Polygon(allp, pOptions);
lGTectonics.addLayer(polyallp);

var polyalltr = new L.Polygon(alltr, trOptions);
lGTectonics.addLayer(polyalltr);

var lGHeatMap = L.layerGroup()//.addTo(map);

var quakePoints = new Array(earthQuakePoints.length); // rows
for (var i = 0; i < quakePoints.length; i++) quakePoints[i] = new Array(3); // 3 columns

for (var i = 0; i < earthQuakePoints.length; i++) {
    quakePoints[i][0] = earthQuakePoints[i][4];
    quakePoints[i][1] = earthQuakePoints[i][5];
    quakePoints[i][2] = earthQuakePoints[i][2];
}

var concentration = L.heatLayer(quakePoints, {
    minOpacity: 0.7,
    radius: 10,
    blur: 15,
    maxZoom: 20,
    gradient: { 0.0: 'green', 0.5: 'yellow', 1.0: 'red' },
    max: 6
});
lGHeatMap.addLayer(concentration);

var pulsingIcon = L.icon.pulse({ iconSize: [15, 15], color: 'green', fillColor: 'green' });
var picon = L.marker([earthQuakePoints[0][4], earthQuakePoints[0][5]], { icon: pulsingIcon, zIndexOffset: 1000, title: 'Last EarthQuake' });
picon.bindPopup("Magnituda: " + earthQuakePoints[0][2].toString() + "<br>" + "Thell&euml;sia: " + earthQuakePoints[0][6].toString() + " km" + "<br>" + "Data: " + earthQuakePoints[0][0] + "<br>" + earthQuakePoints[0][3]);
latestQuake.addLayer(picon);

var overlay = { 'Big Earthquake M>4': lGbigTermet, 'Average Earthquake 3<=M<=4': lGaverageTermet, 'Small Earthquake M<3': lGsmallTermet, 'Tectonics': lGTectonics, 'Concentration': lGHeatMap };
L.control.layers(baseLayers, overlay, { autoZIndex: false }).addTo(map);
//Legenda
function getColor(d) {
    return d > 4 ? 'red' : d < 3 ? 'blue' : 'yellow';
}
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 3, 4],
        labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML = "<h6>Magnituda</h6>"
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' + '<strong style="font-size: 1.2rem">' +
            grades[i] + (grades[i + 1] ? '-' + grades[i + 1] + '</strong><br>' : '+');
    }

    return div;
};

legend.addTo(map);
