let net;

function preprocessImage(image) {
	let tensor = tf.browser.fromPixels(image)
		.resizeNearestNeighbor([160, 160])
		.toFloat();
	return tensor.div(255)
			.expandDims();
}

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await tf.loadLayersModel('https://raw.githubusercontent.com/stazam/DoIwearAmask/main/docs/export_model/model.json');
  console.log('Successfully loaded model');

  // Make a prediction through the model on our image.
  const imgEl = document.getElementById('img');
  const result = await net.predict(preprocessImage(imgEl));
  const nomask = result.dataSync()[0];
  console.log('Prediction done');

  var pred = document.getElementById('pred');
  if (nomask < 0.5) {
      prob = ((1-nomask)*100).toFixed(2);
      pred.innerHTML = "<b>Great you wear a mask!</b> (probability=".concat(prob, "%)");
  } else {
    prob = (nomask*100).toFixed(2);
    pred.innerHTML = "<b>You dont wear a mask!</b> (probability=".concat(prob, "%)");
  }

  return(nomask);
}

app();

// HTML5 image file reader 
if (window.FileReader) {
  function handleFileSelect(evt) {
    var files = evt.target.files;
    var f = files[0];
    var reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          document.getElementById('image').innerHTML = ['<img id="img" crossorigin src="', e.target.result,'" title="', theFile.name, '" width="227"/>'].join('');
        };
      })(f);

      reader.readAsDataURL(f);
   
      app();
  }
} else {
  alert('This browser does not support FileReader');
}

// listener for a new image
document.getElementById('files').addEventListener('change', handleFileSelect, false);