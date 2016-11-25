function createPlot(data, divname){
    // Create plot-holding div
    var newDiv = document.createElement("div");
    newDiv.id = divname;
    document.getElementById("plotContainer").appendChild(newDiv);


    // Create the plot

    MG.data_graphic({
      title: "Testplot",
      description: "Testplot",
      data: MG.convert.date(data, "Date"),
      animate_on_load: true,
      width: 650,
      height: 200,
      target: "#".concat(divname),
      x_accessor: "Date",
      y_accessor: "Value",
      y_label: "NDVI%",
      left: 90
    });
};


function getData(id){
  var queryString = "//*[ID=".concat(id).concat("]");
  var search = JSON.search(data, queryString);
  return search;
}
