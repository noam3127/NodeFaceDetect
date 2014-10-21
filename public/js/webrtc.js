$(document).ready(function() {
  var video, canvas, stream, frame, objUrl;

  var 
    socket = io.connect('http://localhost'),
    mediaOptions = { audio: false, video: true },
    canvas =  document.getElementById('img-canvas'),
    context =  canvas.getContext('2d'),
    dCanvas = document.getElementById('detected'),
    dContext = dCanvas.getContext('2d'),
    img = new Image();
 
  if(!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || 
      navigator.mozGetUserMedia || navigator.msGetUserMedia;
  }

  if(!navigator.getUserMedia) {
    return alert('Sorry, you don\'t have getUserMedia. Try using a different browser.');
  }

  navigator.getUserMedia(mediaOptions, success, function(e) {
    console.log(e);
  });

  function success(stream) {
    video = document.querySelector("#video-player");
    //objUrl = window.URL.createObjectURL(_stream);
    video.src = window.URL.createObjectURL(stream);
    var frame = processCanvas();
    socket.emit('bufferFrame', {imgData: frame});
    socket.emit('imageSourceFrame', {imgData: frame});
  }

  function processCanvas() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    frame = canvas.toDataURL('image/png');
    return frame;
    //socket.emit('frame', {imgData: frame});
  }
  
  socket.on('faceBuffer', function(data) {
    console.log(data);
    var bytes = new Uint8Array(data.mat);
    var str = String.fromCharCode.apply(null, bytes);
    var base64String = btoa(str);
   
    img.onload = function() {
      dContext.drawImage(this, 0, 0);
    }
    img.src = 'data:image/png;base64,' + base64String;
    var nextFrame = processCanvas();
    socket.emit('bufferFrame', {imgData: nextFrame});
  });

  socket.on('faceImage', function(data) {
    var imgElem = document.getElementById('face-image');
    imgElem.src = data.src;
    var nextFrame = processCanvas();
    socket.emit('imageSourceFrame', {imgData: nextFrame});
  });
});