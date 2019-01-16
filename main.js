var imageLoader = document.getElementById('imageLoader')
imageLoader.addEventListener('change', (e) => {
  handleImage(e.target.files[0])
}, false)
var canvas = document.getElementById('imageCanvas')
var ctx = canvas.getContext('2d')
// new image size (resize)
const newImageWidth = 800

function handleImage (rawImage) {
  var reader = new FileReader()
  reader.readAsDataURL(rawImage)
  reader.onload = function (event) {
    var img = new Image()
    img.onload = function (event) {
      // calculate new image size
      const ratio = newImageWidth / img.width
      const newImageHeight = img.height * ratio

      // setup canvas size
      canvas.width = newImageWidth
      canvas.height = newImageHeight

      // reset canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()

      // draw image
      ctx.drawImage(
        img,
        0,
        0,
        newImageWidth,
        newImageHeight
      )

      // make all pure white pixels transparent
      // get the image data object
      var image = ctx.getImageData(0, 0, newImageWidth, newImageHeight);
      // get the image data values 
      // var imageData = image.data
      for(var i = 0; i < image.data.length; i+=4){
          const pixel = {
            red: image.data[i],
            green: image.data[i+1],
            blue: image.data[i+2],
            // alpha: image.data[i+3],
          }
          if ((250 <= pixel.red && pixel.red <= 255) &&
            (250 <= pixel.green && pixel.green <= 255) &&
            (250 <= pixel.blue && pixel.blue <= 255)) {
              image.data[i+3] = 0; // set alpha (=4th channel) to 0
          }
      }
      // after the manipulation, reset the data
      // image.data = imageData;
      // and put the imagedata back to the canvas
      ctx.putImageData(image, 0, 0);
    }
    img.src = event.target.result
  }
}

var lastTarget = null

function isFile (evt) {
  var dt = evt.dataTransfer

  for (var i = 0; i < dt.types.length; i++) {
    if (dt.types[i] === 'Files') {
      return true
    }
  }
  return false
}

window.addEventListener('dragenter', function (e) {
  if (isFile(e)) {
    lastTarget = e.target
    document.querySelector('#dropzone').style.visibility = ''
    document.querySelector('#dropzone').style.opacity = 1
    document.querySelector('#textnode').style.fontSize = '48px'
  }
})

window.addEventListener('dragleave', function (e) {
  e.preventDefault()
  if (e.target === document || e.target === lastTarget) {
    document.querySelector('#dropzone').style.visibility = 'hidden'
    document.querySelector('#dropzone').style.opacity = 0
    document.querySelector('#textnode').style.fontSize = '42px'
  }
})

window.addEventListener('dragover', function (e) {
  e.preventDefault()
})

window.addEventListener('drop', function (e) {
  e.preventDefault()
  document.querySelector('#dropzone').style.visibility = 'hidden'
  document.querySelector('#dropzone').style.opacity = 0
  document.querySelector('#textnode').style.fontSize = '42px'
  if (e.dataTransfer.files.length === 1) {
    // do something with file
    handleImage(e.dataTransfer.files[0])
  }
})
