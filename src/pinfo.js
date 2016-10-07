var img = new Image();
// img.src = 'data/race_1765_photo_35016594.jpg';

var pframeBox = d3.select('#photo-frame-box');
var dropzone = document.getElementById('dropzone');
var droppedFiles;
var imageData;

dropzone.addEventListener("dragover", function(event) { 
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    }, true);
dropzone.addEventListener("drop", function(event) {

    event.preventDefault();
    console.log(event.dataTransfer.files);
    console.log(event.dataTransfer.files[0]);
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
    
    console.log(reader);
    reader.onload = function(e) {
        img.src = reader.result;
    }

    }, true);

var getMaxImageViewWidth = function(pframeBox) {
    return Math.floor(pframeBox.node().getBoundingClientRect().width*0.95);
}
var MAXWIDTH = getMaxImageViewWidth(pframeBox);
var canvas = document.getElementById('photo-frame');
var ctx = canvas.getContext('2d');

var setCanvasDimensions = function(height, width, widthToHeightRatio) {

    MAXWIDTH = getMaxImageViewWidth(pframeBox);
    if (width != MAXWIDTH) {
        width = MAXWIDTH;

        height = width/widthToHeightRatio;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
}


img.onload = function() {
        ctx.drawImage(img, 0, 0);
        var width = img.width;
        var height = img.height;

        widthToHeightRatio = width/height;
        setCanvasDimensions(height, width, widthToHeightRatio);

        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                       .data;
        console.log(imageData[5]);
        makeImageHists(imageData);

        // resize canvas and photo display if window size changes
        window.addEventListener("resize", function () {
            setCanvasDimensions(height, width, widthToHeightRatio);
        });

};

function makeImageHists(imageData) {

    d3.select("#photo-info")
      .text("loading");
    var reds = [];
    var greens = [];
    var blues = [];

    console.log(imageData.length);
    console.log(imageData[5]);

    for (var i=0; i < imageData.length; i+=4) {
        reds.push(imageData[i]);
        greens.push(imageData[i+1]);
        blues.push(imageData[i+1]);
    }
    console.log("reds: "+reds.length);
    console.log(reds);
    console.log("greens: "+greens.length);
    console.log(greens);
    console.log("blues: "+blues.length);
    console.log(blues);
}