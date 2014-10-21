var 
  fs = require('fs'),
  base64Decoder = require('base64-arraybuffer'),
  faceDetect = require('./faceDetect'),
  cv = require('opencv'),
  //filename = 'sample.png',
  
  imgData;

module.exports = function(socket) {

	var 
    counter = 1,
    mod,
    path = './savedImages/',
    filename;// = 'temp.png';

  socket.on('imageSourceFrame', function(data){
    //console.log(data);
    console.log('frame');
    imgData = data.imgData.replace(/^data:image\/png;base64,/, "");
    mod = counter++ % 5;
    filename = 'sample' + mod + '.png';

    fs.writeFile(path + filename, imgData, 'base64', function(err) {
      if(err) throw(err);
      console.log('saved ' + filename);
      faceDetect(path, filename, socket);
    });
  });

  socket.on('bufferFrame', function(data) {
    imgData = data.imgData.replace(/^data:image\/png;base64,/, "");
    var decodedImg = new Buffer(imgData, 'base64');
    cv.readImage(decodedImg, function(err, im) {
      im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
        for (var i = 0; i < faces.length; i++) {
          var x = faces[i];
          var face = faces[i];
          im.ellipse(x.x + x.width / 2, x.y + x.height / 2, x.width / 2, x.height / 2);
        }
        console.log(im);
        socket.emit('faceBuffer', {mat: im.toBuffer()});
      });
    });
  });
};