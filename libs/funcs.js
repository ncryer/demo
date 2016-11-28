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


function collectIDs(resArray){
  var IDarray = [];
  resArray.forEach(function(row){
    IDarray.push(row["ID"]);
  });
  return IDarray;
};

function getTimeSeries(ID){
  var endpoint = endpointBaseUrl + "/timeseries"
  $.ajax({
    url: endpoint,
    data: {'id': ID},
    success: function(data){
      // Do stuff with data
      console.log("---- timeseries ------");
      console.log(data);
      createPlot(data, "testplot");
    }
  });
};
