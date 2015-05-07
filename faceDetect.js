var cv = require('opencv'),
    fs = require('fs');

module.exports = function(path, imgName, socket) {
  cv.readImage(path + imgName, function(err, im) {
    im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
      for (var i = 0; i < faces.length; i++) {
        var x = faces[i];
        var face = faces[i];
        im.ellipse(x.x + x.width / 2, x.y + x.height / 2, x.width / 2, x.height / 2);
      }
      im.save('./public/detectedFaces/' + imgName);
      console.log(im);
      socket.emit('faceImage', {src: './detectedFaces/' + imgName});
    });
  });
};
