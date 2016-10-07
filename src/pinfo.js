var img = new Image();
img.src = 'data/race_1765_photo_35016594.jpg';

var pframeBox = d3.select('#photo-frame-box');
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

        // resize canvas and photo display if window size changes
        window.addEventListener("resize", function () {
            setCanvasDimensions(height, width, widthToHeightRatio);
        });

    };