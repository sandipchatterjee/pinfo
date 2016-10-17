var img = new Image();

var pframeBox = d3.select('#photo-frame-box');
var dropzone = document.getElementById('dropzone');
var droppedFiles;
var imageData;
var SCALINGFACTOR = 1;

dropzone.addEventListener("dragover", function(event) { 
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    }, true);
dropzone.addEventListener("drop", function(event) {

    event.preventDefault();

    savedName = event.dataTransfer.files[0].name;
    droppedFiles = event.dataTransfer.files;

    var reader = new FileReader();
    firstFile = droppedFiles[0];

    d3.select("#filename")
      .text(firstFile.name);
    d3.select("#filetype")
      .text(firstFile.type + ", ");
    d3.select("#filesize")
      .text(d3.format(".1")(firstFile.size/1024/1024) + " MB");
    
    reader.readAsDataURL(firstFile);
    
    reader.onload = function(e) {
        img.src = reader.result;
    }

    }, true);

var getMaxImageViewWidth = function(pframeBox) {
    return Math.floor(pframeBox.node().getBoundingClientRect().width*0.95);
}
var MAXWIDTH = getMaxImageViewWidth(pframeBox);

var pinfoBox = d3.select('#photo-info-box');
var MAXPLOTWIDTH = getMaxImageViewWidth(pinfoBox)

var canvas = document.getElementById('photo-frame');
var ctx = canvas.getContext('2d');

var setCanvasDimensions = function(height, width, widthToHeightRatio) {

    MAXWIDTH = getMaxImageViewWidth(pframeBox);
    if (width != MAXWIDTH) {
        oldWidth = width;
        width = MAXWIDTH;

        height = width/widthToHeightRatio;
    }
    else {
        oldWidth = width;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    return width/oldWidth;

}


img.onload = function() {
        ctx.drawImage(img, 0, 0);
        var width = img.width;
        var height = img.height;

        widthToHeightRatio = width/height;
        SCALINGFACTOR = setCanvasDimensions(height, width, widthToHeightRatio);

        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                       .data;

        makeImageHists(imageData);

        // resize canvas and photo display if window size changes
        window.addEventListener("resize", function () {
            SCALINGFACTOR = setCanvasDimensions(height, width, widthToHeightRatio);
        });

};

function makeImageHists(imageData) {

    d3.select("#photo-info")
      .text("loading");
    var reds = [];
    var greens = [];
    var blues = [];

    for (var i=0; i < imageData.length; i+=4) {
        reds.push(imageData[i]);
        greens.push(imageData[i+1]);
        blues.push(imageData[i+1]);
    }

    makeHist(reds, d3.select("#photo-info-red"), "reds");


    makeHist(greens, d3.select("#photo-info-green"), "greens");


    makeHist(blues, d3.select("#photo-info-blue"), "blues");
}

function makeHist(data, element, label="new histogram") {

    element.select("svg")
           .remove();

    element.select("p")
           .remove();

    var formatCount = d3.format(",.0f");

    var margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = MAXPLOTWIDTH - margin.left - margin.right,
        height = Math.floor(MAXPLOTWIDTH/2) - margin.top - margin.bottom;

    var x = d3.scaleLinear()
              .domain([1, 255])
              .range([0, width]);

    var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(30))
        (data);

    allData = []
    for (var i = 0; i < bins.length; i++) {
        allData[i] = { "bins": bins[i],
                       "yMin": d3.min(bins[i]),
                       "yMax": d3.max(bins[i])
                    };
    }

    var y = d3.scaleLinear()
        .domain([0, d3.max(allData, function(d) { return d.bins.length; })])
        .range([height, 0]);

    element.append("p")
           .text(label);

    var svg = element.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(allData)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.bins.x0) + "," + y(d.bins.length) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(allData[0].bins.x1) - x(allData[0].bins.x0) - 5)
        .attr("height", function(d) { return height - y(d.bins.length); });

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    element.transition()
           .duration(1200)
           .style("opacity", 1);

}

function getMatchingBars(pixelValue, subplot) {
    var allBars = d3.select("#"+subplot).selectAll(".bar");
    var selectedBars = allBars.filter(function(d) { return (pixelValue >= d.yMin) && (pixelValue <= d.yMax); });

    return selectedBars;
}

d3.select('#photo-frame').on("mousemove", function(event) {

    canvasImage = d3.select(this);

    var mousePos = d3.mouse(canvasImage.node());
    var x = mousePos[0];
    var y = mousePos[1];

    var adjustedX = Math.floor(x / SCALINGFACTOR);
    var adjustedY = Math.floor(y / SCALINGFACTOR);

    var ctx = canvas.getContext('2d');
    var rgba = ctx.getImageData(x, y, 1, 1).data;
    var r = rgba[0];
    var g = rgba[1];
    var b = rgba[2];

    var hex = "#" + ("000000" + convertRGBToHex(r,g,b)).slice(-6);
    var infoBox = d3.select('#mouse-position');
    var satBox = d3.select('#sat-box');
    infoBox.style("display", "initial");
    infoBox.text("("+adjustedX+", "+adjustedY+") " + hex);
    infoBox.style("background", hex);
    
    var matchedBars = [];
    matchedBars.push(getMatchingBars(r, "photo-info-red"));
    matchedBars.push(getMatchingBars(r, "photo-info-green"));
    matchedBars.push(getMatchingBars(r, "photo-info-blue"));

    for (var i = 0; i < matchedBars.length; i++) {
        matchedBars[i].style("opacity", 0.2)
                      .transition()
                        .duration(200)
                        .style("opacity", 1.0);
    }
})

function convertRGBToHex(red, green, blue) {
    return ((red << 16) | (green << 8) | blue).toString(16);
}