var API_KEY = "*SKY BIOMETRY API KEY GOES HERE*";
var API_SECRET = "*SKY BIOMETRY API SECRET GOES HERE*";

//initialization of webcam variables
var width=320;
var height=0;
var streaming = false;
var video = null;
var canvas = null;
var photo = null;
var startbutton = null;

function uploadFile() {
	var formData = new FormData();
	formData.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
	
	var phpServer = new XMLHttpRequest();
	phpServer.addEventListener("load", uploadComplete, false);
	phpServer.addEventListener("error", uploadFailed, false);
	phpServer.addEventListener("abort", uploadCancelled, false);
	phpServer.open("POST", "upload.php");
	phpServer.send(formData);
	console.log("Uploading...");
}

function uploadComplete(event) {
	console.log(event.target.responseText);
	//get file name and perform get request
	
	$.get (
		"http://api.skybiometry.com/fc/faces/detect.json?api_key=" + API_KEY + "&api_secret=" + API_SECRET + "&urls=http://davidvuong.ca/Upload/uploads/" + event.target.responseText + "&attributes=all", function(data) {
			console.log(data);
		});
}

function uploadFailed(event) {
	console.log("An error occured while uploading the file.");
}

function uploadCancelled(event) {
	console.log("The upload has been cancelled by the user or the browser dropped the connection.");
}

function initializeWebcam() {
	video = document.getElementById("video");
	canvas = document.getElementById("canvas");
	photo = document.getElementById("photo");
	startbutton = document.getElementById("startbutton");
	
	navigator.getUserMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia ||
						   null);
	console.log(navigator.getUserMedia);
	
	navigator.getUserMedia({video: true, audio: false}, function(stream) {
		if (navigator.mozGetUserMedia) {
			video.mozSrcObject = stream;
		}
		else {
			var vendorURL = window.URL || window.webkitURL;
			video.src = vendorURL.createObjectURL(stream);
		}
		video.play();
	}, function(err) {
		console.log("An error occured! " + err);
	});
	
	video.addEventListener('canplay', function(ev) {
		if (!streaming) {
			height = video.videoHeight / (video.videoWidth/width);
			
			if (isNaN(height)) {
				height = width / (4/3);
			}
			
			video.setAttribute('width', width);
			video.setAttribute('height', height);
			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);
			streaming = true;
		}
	}, false);
	
	startbutton.addEventListener('click', function(ev) {
		takePicture();
		ev.preventDefault();
	}, false);
	
	clearPhoto();
}

function clearPhoto() {
	var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
}

function takePicture() {
	var context = canvas.getContext('2d');
    if (width && height) {
		canvas.width = width;
		canvas.height = height;
		context.drawImage(video, 0, 0, width, height);
    
		var data = canvas.toDataURL('image/png');
		photo.setAttribute('src', data);
		console.log(data);
    } 
	else {
      clearPhoto();
    }
}