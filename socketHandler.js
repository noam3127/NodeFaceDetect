var
  fs = require('fs'),
  faceDetect = require('./faceDetect'),
  cv = require('opencv');
  // base64Decoder = require('base64-arraybuffer'),
  faceRec = require('./faceRecognize'),

module.exports = function(socket) {

  var
    counter = 1,
    path = './savedImages/',
    mod, filename, imgData;

  socket.on('imageSourceFrame', function(data) {
    imgData = data.imgData.replace(/^data:image\/png;base64,/, '');
    mod = counter++ % 20;
    filename = 'sample' + mod + '.png';

    fs.writeFile(path + filename, imgData, 'base64', function(err) {
      if(err) throw(err);
      //console.log('saved ' + filename);
      faceDetect(path, filename, socket);
    });

  });

  socket.on('bufferFrame', function(data) {
    //faceRec();
    imgData = data.imgData.replace(/^data:image\/png;base64,/, '');
    var decodedImg = new Buffer(imgData, 'base64');
    cv.readImage(decodedImg, function(err, im) {
      im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
        for (var i = 0; i < faces.length; i++) {
          var x = faces[i];
          var face = faces[i];
          im.ellipse(x.x + x.width / 2, x.y + x.height / 2, x.width / 2, x.height / 2);
        }
        socket.emit('faceBuffer', { mat: im.toBuffer() });
      });
    });
  });
};