let SEL_IMG = []
let __SEL_IMG = []



var _temp_name = []

function imageCapture() {
	println(" * CAMERA Start")
	var options = {
		limit: 1
	};
	navigator.device.capture.captureImage(onSuccess, onError, options);

	function onSuccess(mediaFiles) {
		var i, path, len;
		for (i = 0, len = mediaFiles.length; i < len; i += 1) {
			var path = mediaFiles[i].fullPath;
			console.log(path);
			var file__name = path.split("/")[path.split("/").length-1]

			SEL_IMG.push(file__name)
			save_img_name(path)
			println()
			console.log(mediaFiles);
		}
	}

	function onError(error) {
		println(" * CAMERA ERROR")
		navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
	}
}



// ---------------------------------------------
function _imageCapture(document_name) {
	println(" * CAMERA Start")
	var temp_name = []
	var options = {
		limit: 1
	};
	navigator.device.capture.captureImage(onSuccess, onError, options);

	function onSuccess(mediaFiles) {
		var i, path, len;
		for (i = 0, len = mediaFiles.length; i < len; i += 1) {
			path = mediaFiles[i].fullPath;
			temp_name.push(path)
			var file__name = path.split("/")[path.split("/").length-1]
			__SEL_IMG.push({
				"document_name": document_name,
				"document_image": file__name,
				"document_type": "upload"
			})
			save_img_name(path)
		}
	}

	function onError(error) {
		println(" * CAMERA ERROR")
		navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
	}
	println(JSON.stringify(temp_name))
	// 
}

function save_img_name(name__){
	// var img_cont = $ID("img_cont")
	var img_cont = ""
		println(" * CAMERA JSON SAVING")
		_readFileEntry("images.txt",function (res){
			var ls_img = JSON.parse(res)
			ls_img.push(name__)
			__createNewFileEntry("images.txt",JSON.stringify(ls_img),function (){
				img_cont += `<img src="`+name__+`" class="x-img x-border" style="max-width:40%">`
				$ID("img_cont").innerHTML += img_cont
			})
		})
}

// to view the uploaded image
// https://cswdtrain.novusoftit.com/public/uploaded/temps/testupload/1656495392596.jpg
function SYNC_DATA_IMAGE(){
	println(" == SYNCING DATA IMAGE")
	var remoteUrl = "https://cswdtrain.novusoftit.com/api/upload-image"
	_readFileEntry("images.txt",function (res){
		var ls_img = JSON.parse(res)
		for (var i = 0; i < ls_img.length; i++) {
			var fileUri = ls_img[i]
			var fileName = fileUri.split("/")[fileUri.split("/").length-1]
			println(fileName)
			uploadFileToServer (fileUri, fileName, remoteUrl, function(err){
				if (err) {
					console.error('Error uploading file', err)
				} else {
					console.log('Upload done it with success')
				}
			})
			// break
		}
		// __createNewFileEntry("images.txt",JSON.stringify(ls_img),function (){

		// })
	})
}


function upload_img_(argument) {
}


// --------------------------------
function uploadFileToServer (fileUri, fileName, remoteUrl, callback) {
	window.resolveLocalFileSystemURL(fileUri, function (fileEntry) {
		fileEntry.file(function (file) {
			var reader = new FileReader()
			reader.onloadend = function () {
				var blob = new Blob([new Uint8Array(this.result)], { type: 'application/octet-stream' })
				// var blob = new Blob([new Uint8Array(this.result)], { })
				// var fd = new FormData()
				var fd = $DATA({"timestamp":$datetime()})

				fd.append('file[]', blob, fileName)
				// fd.append('file', blob)

				// println("File PaTh :" + fileUri)
				println("FILE OBJ :" + JSON.stringify(file))
				// println("BLOB :" + JSON.stringify(blob))

				$send({
					action : remoteUrl,
					method : POST,
					data : fd,
					func : function (res){
						println("Done Uploading Image : ["+fileName+"]")
						println(res)
					},
					err : function(errs){
						println( " ERROR FROM ERRS")
						// println( JSON.stringify(errs))
					}
				})
				// var xhr = new XMLHttpRequest()
				// xhr.open('POST', remoteUrl, true)
				// xhr.onload = function () {
				// 	if (xhr.status === 200) {
				// 		if (typeof callback === 'function') { callback() }
				// 	} else {
				// 		if (typeof callback === 'function') { callback(xhr.status) }
				// 	}
				// }
				// xhr.onerror = function (err) {
				// 	if (typeof callback === 'function') { callback(err) }
				// }
				// xhr.send(fd)
			}
			reader.readAsArrayBuffer(file)
		}, function (err) {
			if (typeof callback === 'function') { callback(err) }
		})
	})
}
