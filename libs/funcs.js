function createPlot(data, divname){
    // Create plot-holding div
    var newDiv = document.createElement("div");
    newDiv.id = divname;
    document.getElementById("plotContainer").appendChild(newDiv);


    // Create the plot
    var targetStr = "#".concat(divname);
    MG.data_graphic({
      title: "Testplot",
      description: "Testplot",
      data: MG.convert.date(data, "Date"),
      animate_on_load: true,
      width: 750,
      height: 200,
      target: targetStr,
      x_accessor: "Date",
      y_accessor: "Value",
      y_label: "NDVI%",
      left: 90
    });

    $(targetStr).css("text-align", "center");
    // Make linebreak?
};

function makeAndSavePlot(timeseries, divname, data){
  // Create plot-holding div
  var newDiv = document.createElement("div");
  newDiv.id = divname;

  var targetStr = "#".concat(divname);


  // Append to plotContainer
  document.getElementById("plotContainer").appendChild(newDiv);
  // Extract plot variables
  var cropName = data["Afgnavn"];
  var fieldNum = data['Marknr'];
  var plotTitle = "Vækstkurve: " + cropName + ", mark: " + fieldNum;
  // Create a plot on the div
  MG.data_graphic({
    title: plotTitle,
    description: "Biomasse på markarealet",
    data: MG.convert.date(timeseries, "Date"),
    animate_on_load: true,
    width: 750,
    height: 200,
    target: targetStr,
    x_accessor: "Date",
    y_accessor: "Value",
    y_label: "NDVI%",
    left: 90
  });

  // add centering css'
  $(targetStr).css("text-align", "center");
  $(targetStr).addClass("timeseries");
  $(targetStr).hide();
};

var GLOBAL_OLD_PROJECTION = 'EPSG:4326';
var GLOBAL_MAIN_PROJECTION = 'EPSG:900913';
var GEOSERVER_WMS = 'http://localhost:8080/geoserver/wms'
// Reproject lat/lon

function toXY(row){
  var lat = row["Latitude"];
  var lon = row['Longitude'];
  var res = ol.proj.transform([lon, lat], GLOBAL_MAIN_PROJECTION, GLOBAL_OLD_PROJECTION);
  return res;
};


function cqlQuery(idArray){
  var WMSurl = "http://localhost:8080/geoserver/seges/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=seges:polygons&maxFeatures=50&outputFormat=application%2Fjson";
  var cqlString = "&cql_filter=";
  var tup = "(";
  tup += idArray.join();
  tup += ")";
  var queryStr = encodeURI("OGC_FID IN " + tup);



  var fullWMS = WMSurl + cqlString + queryStr;
  console.log(fullWMS);
  $.ajax({
    url: fullWMS,
    dataType: "json",
    success: function(data){
      console.log("adding polygons to map");
      //console.log(data);
        // DRAW POLYGONS ON MAP
        var vectorSource = new ol.source.Vector({
          features: (new ol.format.GeoJSON()).readFeatures(data)
        });
        var vectorLayer = new ol.layer.Vector({
          source: vectorSource
        });
        map.addLayer(vectorLayer);
        // Add onClick listeners to table rows!
        var feats = vectorSource.getFeatures();
        feats.forEach(function(featies){
          console.log(featies.getProperties());
          var props = featies.getProperties();
          console.log(featies.getGeometry().getExtent());
          var extent = featies.getGeometry().getExtent();

          var id = props["OGC_FID"];

          // Create the row div name
          var rowName = "#row" + id;
          $(rowName).click(function(){
            console.log("ID:"+id);
            // Zoom to map extent
            map.getView().fit(extent, map.getSize());
            // Find the corresponding timeseries plot, move it to visible container
            // Hide all timeseries, show only current
            var allPlots = document.getElementsByClassName("timeseries");
            for(i=0; i < allPlots.length; i++){
              var toHide = "#" + allPlots[i].id;
              $(toHide).hide();
            }
            var divName = "#Timeseries_plot" + id;
            $(divName).show();
          });
        });
      }
    });
  }


function collectIDs(resArray){
  var IDarray = [];
  resArray.forEach(function(row){
    IDarray.push(row["ID"]);
  });
  return IDarray;
};

function getTimeSeries(ID, plotname, rowData){
  var endpoint = endpointBaseUrl + "/timeseries"
  $.ajax({
    url: endpoint,
    data: {'id': ID},
    success: function(data){
      // Do stuff with data
      //createPlot(data, plotname);
      makeAndSavePlot(data, plotname, rowData);
    }
  });
};

function insertTableRow(marknr, id){
  var tableRef = document.getElementById('containerTable').getElementsByTagName('tbody')[0];
  var newRow = tableRef.insertRow(tableRef.rows.length);
  var idStr = "row" + id;
  newRow.id = idStr;
  var newCell = newRow.insertCell(0);
  newCell.className = "lefty";
  var txt = document.createTextNode(marknr);
  newCell.appendChild(txt);
}
