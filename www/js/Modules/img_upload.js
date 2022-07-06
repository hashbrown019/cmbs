// let SEL_IMG = []
// let version = "12"

// println(" Form Packer Active . . . ")
// function upload(){
// 	imageCapture()
// 	SEL_IMG = []
// 	var _file = $ID("file")
// 	for (var i = 0; i < _file.files.length; ++i) {
// 		SEL_IMG.push( _file.files.item(i).name)
// 	}
// 	println(JSON.stringify(SEL_IMG))
// 	// $send({
// 	// 	action : "https://cswdtrain.novusoftit.com/api/upload-image",
// 	// 	method : POST,
// 	// 	data : $DATA({"timestamp":$datetime()}).appendFileArr(_file),
// 	// 	func : function (res){
// 	// 		println(JSON.parse(res))
// 	// 		alert("Uploading Done")
// 	// 	},
// 	// 	err : function(){
// 	// 		alert("Failed to upload")
// 	// 	}
// 	// })
// }

// let __SEL_IMG = []

// function _upload(document_name){
// 	// __SEL_IMG = []
// 	imageCapture()
// 	var _file = $ID("file")
// 	for (var i = 0; i < _file.files.length; ++i) {
// 		// __SEL_IMG.push( _file.files.item(i).name)
// 		__SEL_IMG.push({
// 			"document_name": document_name,
// 			"document_image": _file.files.item(i).name,
// 			"document_type": "upload"
// 		})
// 	}
// 	// println(JSON.stringify(__SEL_IMG))
// 	$send({
// 		action : "https://cswdtrain.novusoftit.com/api/upload-image",
// 		method : POST,
// 		data : $DATA({"timestamp":$datetime()}).appendFileArr(_file),
// 		func : function (res){
// 			println(JSON.parse(res))
// 			alert("Uploading Done")
// 		},
// 		err : function(){
// 			alert("Failed to upload")
// 		}
// 	})
// }
// // 