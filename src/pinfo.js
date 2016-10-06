var img = new Image();
img.src = 'data/race_1765_photo_35016594.jpg';
imgHeight = img.height;
imgWidth = img.width;
widthToHeight = imgWidth/imgHeight;

var canvas = document.getElementById('photo-frame');
var ctx = canvas.getContext('2d');
img.onload = function() {
        ctx.drawImage(img, 0, 0);
        // img.style.display = 'none';
    };

var pframeBox = d3.select('#photo-frame-box');
var pframe = d3.select('#photo-frame');
var getMaxImageViewWidth = function(pframeBox) {
    return Math.floor(pframeBox.node().getBoundingClientRect().width*0.95);
}
currentWidth = getMaxImageViewWidth(pframeBox);
var setCanvasDimensions = function(pframeBox, pframe) {

    console.log("resizing");
    clientDivWidth = getMaxImageViewWidth(pframeBox);
    clientDivHeight = clientDivWidth/widthToHeight;
    // set canvas width to max 
    pframe.attr("width", clientDivWidth);
    pframe.attr("height", clientDivHeight);

    ctx.drawImage(img, 0, 0, clientDivWidth, clientDivHeight);
}

setCanvasDimensions(pframeBox, pframe);

// resize canvas and photo display if window size changes
window.addEventListener("resize", function () { 

    // only resize canvas and image if surrounding div's width changes
    if (currentWidth != getMaxImageViewWidth(pframeBox)) {
        setCanvasDimensions(pframeBox, pframe);
    }
});
