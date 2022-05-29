document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
	var watchID = navigator.geolocation.watchPosition(onSuccess, onError, {  maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
}

function re_create_inputs(){
	$ID('current_log').innerHTML = "<span class='fa fa-crosshairs fa-spin'></span>"
	$ID('current_lat').innerHTML = "<span class='fa fa-crosshairs fa-spin'></span>"
	$ID('set_manual').style.display = "none"
	$ID('show_location').style.display = "none"
	$ID('insert_document').style.display = "none"

	$ID('set_location').innerHTML = "GetCurrent Location<span id='geo_note'> <span class='fa fa-crosshairs '></span></span"
	$ID('set_location').classList.add("x-btn","x-block","x-green")
	$ID('label_location').classList.add("x-padding","x-container","x-round-large","x-card","x-center")

	add_class2class("form-control","x-select","x-border")

	$ID('set_location').addEventListener("touchend", get_location)

}

// -------------------------------------------------------------------------------------------
function get_location(){
	println("******* Getting Locatioon . . . ")
	$ID('geo_note').innerHTML = '<br><span class="x-tiny">This may take a while. Please wait.<br>its advisable that you are outside while <br>getting the location for faster and accurate result</span>'
	var onSuccess = function(position) {
		// alert('Latitude: '          + position.coords.latitude          + '\n' +
		// 	  'Longitude: '         + position.coords.longitude         + '\n' +
		// 	  'Altitude: '          + position.coords.altitude          + '\n' +
		// 	  'Accuracy: '          + position.coords.accuracy          + '\n' +
		// 	  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
		// 	  'Heading: '           + position.coords.heading           + '\n' +
		// 	  'Speed: '             + position.coords.speed             + '\n' +
		// 	  'Timestamp: '         + position/''
		$ID('longitude').value=position.coords.longitude 
		$ID('latitude').value=position.coords.latitude
		$ID('current_log').innerHTML = position.coords.longitude 
		$ID('current_lat').innerHTML = position.coords.latitude 
		$ID('set_location').innerHTML = "Getting Current Location<span id='geo_note'> <span class='fa fa-crosshairs '></span></span"
	};

	// onError Callback receives a PositionError object
	//
	function onError(error) {
		$ID('geo_note').innerHTML = '<br><span class="x-tiny">code: ' + error.code + ' | ' + 'message: ' + error.message + '</span>'
	}
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
	var watchID = navigator.geolocation.watchPosition(onSuccess, onError, {  maximumAge: 3000, timeout: 500000, enableHighAccuracy: true });

}