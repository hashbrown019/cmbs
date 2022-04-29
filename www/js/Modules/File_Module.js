try{
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
		console.log(cordova.file);
		println(" * File Module Ready ================================");
	}
}catch(err){println(err)}

function _createNewFileEntry(file_name,file_data) {
	println("============cordova.file.externalDataDirectory===============")
	println(cordova.file.externalDataDirectory)
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function success(dirEntry) {
		dirEntry.getFile(file_name, { create: true, exclusive: false }, function (fileEntry) {
			writeFile(fileEntry, file_data);
		}, _onErrorCreateFile);
	}, _onErrorResolveUrl);
}

function writeFile(fileEntry, dataObj) {
	fileEntry.createWriter(function (fileWriter) {
		fileWriter.onwriteend = function() {console.log("Successful file write...");};
		fileWriter.onerror = function (e) {console.log("Failed file write: " + e.toString());};
		var _dataObj = new Blob([dataObj], { type: 'text/plain' });
		// var _dataObj = new Blob([dataObj], { type: 'timage/jpeg' });
		// if (!dataObj) {dataObj = new Blob(dataObj, { type: 'image/jpeg' });}
		// if (!dataObj) {dataObj = new Blob(dataObj, { type: 'text/plain' });}
		// fileWriter.write(dataObj);
		fileWriter.write(_dataObj);
	});
}

// -------------------------------
function _readFileEntry(file_name,func) {
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function success(dirEntry) {
		dirEntry.getFile(file_name, { create: true, exclusive: false }, function (fileEntry) {
			// writeFile(fileEntry, JSON.parse(DATA_SYNC));
			readed_cont = readFile(fileEntry,func)
			// $print(" readed content ---- :" + readed_cont)
			return readed_cont
		}, _onErrorCreateFile);
	}, _onErrorResolveUrl);
}

function readFile(fileEntry,func) {

	fileEntry.file(function (file) {
		var reader = new FileReader();
		reader.onloadend = function() {
			func(this.result)
			return this.result
		};
		rdsa = reader.readAsText(file);
	}, onErrorReadFile);
}

// ---------------------------------------
function _onErrorResolveUrl(e){console.log("_onErrorResolveUrl xxxxxxxxxxxxxxxxxxxxxxxx");console.log(e);};
function _onErrorCreateFile(e){console.log("Create file fail xxxxxxxxxxxxxxxxxxxxxxxxx");console.log(e);};
function onErrorReadFile(e){$print(e)}


function listDir(path){
	// files_names =  [] 
	window.resolveLocalFileSystemURL(path,
		function (fileSystem) {
			var reader = fileSystem.createReader();
			reader.readEntries(
				function (entries) {
					for (var i = 0; i < entries.length; i++) {
						entries[i].file(function (file) {
							__FILES__.push(file.name)
						})
					}
					return __FILES__
				},
				function (err) {console.log(err);}
			);
		}, function (err) {console.log(err);}
	);
	// return files_names
}
//example: list of www/audio/ folder in cordova/ionic app.