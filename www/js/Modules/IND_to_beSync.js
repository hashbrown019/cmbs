document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	console.log(cordova.file);
	println(" * individual Module Ready ===================");
	get_sync()
}