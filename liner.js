var cv = require('opencv');


// color definition
// B, G, R
var YELLOW1 = [50, 210, 150];
var YELLOW2 = [150, 255, 255];
const WHITE = [255, 255, 255];
const RED = [0, 0, 255];

// open image
cv.readImage('./files/File1.jpeg', function (err, im) {
    if (err) {
        throw err;
    }
    var width = im.width();
    var height = im.height();
    if (width < 1 || height < 1) {
        throw new Error('Image has no size');
    }

// new picture definition
//    var yellow_picture = new cv.Matrix (height, width);
    var yellow_picture = im.copy();

// select yellow

    yellow_picture.inRange (YELLOW1, YELLOW2);

    yellow_picture.erode (3);
    yellow_picture.dilate (5);
    yellow_picture.erode (2);
    yellow_picture.dilate (10);
    yellow_picture.erode (5);

 //   yellow_picture.gaussianBlur([5, 5]);

    const lowThresh = 0;
    const highThresh = 150;
    const iterations = 2;

    yellow_picture.canny(lowThresh, highThresh);

    var contours;
    contours = yellow_picture.findContours();

// if we draw all contours
// yellow_picture.drawAllContours(contours, WHITE);
//    yellow_picture.dilate (3);

    let largestContourImg;
    let largestArea = 0;
    let largestAreaIndex;

    for (let i = 0; i < contours.size(); i++) {
        if (contours.area(i) > largestArea) {
            largestArea = contours.area(i);
            largestAreaIndex = i;
        }
    }

    yellow_picture.drawContour(contours, largestAreaIndex, WHITE, 3, 1);

    let bound;
    bound = contours.boundingRect(largestAreaIndex);
    yellow_picture.rectangle([bound.x, bound.y], [bound.width, bound.height], WHITE, 2);

    yellow_picture.save('./files/myNewImage.jpg');
});


