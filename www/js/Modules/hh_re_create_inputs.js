document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
	// get_location()
	// var watchID = navigator.geolocation.watchPosition(onSuccess, onError, {  maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
}

function re_create_inputs(){
	$ID('longitude').type = "text"
	$ID('latitude').type = "text"
	$ID('set_manual').style.display = "none"
	$ID('show_location').style.display = "none"
	$ID('insert_document').style.display = "none"

	$ID('set_location').innerHTML = "Get Current Location<span id='geo_note'> <span class='fa fa-crosshairs '></span></span>"
	$ID('set_location').classList.add("x-btn","x-block","x-green")
	$ID('label_location').classList.add("x-padding","x-container","x-round-large","x-card","x-center")

	add_class2class("form-control","x-select","x-border")

	$ID('set_location').addEventListener("touchend", get_location)
	HH_search_records() ///////// DROPDOWN FOR INDIVIDAUL TO ADD TO AHH
}

// -------------------------------------------------------------------------------------------

function get_location(){
	try{
		println("******* Getting Locatioon . . . ")
		$ID('geo_note').innerHTML = '<br><span class="x-tiny">This may take a while. Please wait.<br>its advisable that you are outside while <br>getting the location for faster and accurate result</span>'
		var onSuccess = function(position) {
			$ID('longitude').value = position.coords.longitude 
			$ID('latitude').value = position.coords.latitude
			$ID('longitude').style.display = "block"
			$ID('latitude').style.display = "block"
			$ID('current_log').innerHTML = position.coords.longitude 
			$ID('current_lat').innerHTML = position.coords.latitude 
			$ID('set_location').innerHTML = "Getting Current Location<span id='geo_note'> <span class='fa fa-crosshairs '></span></span"
		};

		// onError Callback receives a PositionError object
		
		function onError(error) {
			$ID('geo_note').innerHTML = '<br><span class="x-tiny">code: ' + error.code + ' | ' + 'message: ' + error.message + '</span>'
		}
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
		var watchID = navigator.geolocation.watchPosition(onSuccess, onError, {  maximumAge: 3000, timeout: 500000, enableHighAccuracy: true });
	}catch{
		println(" * Warning at function hh_re_create_input>get_location")
	}

}


let ls_sele = []
function HH_search_records(){
	ls_sele = []
	var sel_ind_ls = $ID('search_record')
	var indv_list = DATA.record.individual
	for (var i = 0; i < indv_list.length; i++) {
		ls_sele.push(indv_list[i].last_name+", "+indv_list[i].first_name+" "+indv_list[i].middle_name+","+indv_list[i].ext_name+" |"+indv_list[i].record_id)
	}
	ls_sele.sort()

	sel_ind_ls.parentNode.innerHTML  =`
		<h4> Search Individual</h4>
		<input class='x-input x-border' placeholder="LastName, FirstName . . ." onkeyup="INPUT_HH_search_records(this)"><br>
			If the name is not on the list <b class="x-text-blue" onclick="addnew_hh_ind()"> click here</b> to add
		<hr>`

}

function INPUT_HH_search_records(val){
	_autocomplete(val,ls_sele)
}
function CHANGE_HH_search_records(val){
	___get_ind_data(val.split("|")[1],DATA.record.individual)
	add_to_ind_list(val.split("|")[1],DATA.record.individual)

}
//go_edit

function add_to_ind_list(val_id, indv_list){
	// LS_IND_HH.push(val_id)
	_readFileEntry("to_beSync.txt",function (resp_){
		var to_beSync = JSON.parse(resp_);
		var all_mem = indv_list.concat(to_beSync.data.individual)
		// println(JSON.stringify(all_mem))
		try{
			var table_in_hh = ''
			for (var i = 0; i < all_mem.length; i++) {
				if(val_id == all_mem[i].record_id){
					LS_IND_HH.push(val_id)
					table_in_hh += `
						<tr class='ls_ind_tbl' id="`+all_mem[i].record_id+`">
							<td><button onclick="remove_ind(`+all_mem[i].record_id+`)" class="x-btn x-round-large x-orange">Remove <span class="fa fa-trash  "></span></button></td>
							<td>`+all_mem[i].last_name+", "+all_mem[i].first_name+" "+all_mem[i].middle_name+","+all_mem[i].ext_name+`</td>
							<td>`+all_mem[i].sex+`</td>
							<td>`+all_mem[i].birthdate+`</td>
							<td>`+all_mem[i].geo_map_group_id+`</td>
							<td>`+all_mem[i].group_status+`</td>
							<td>`+all_mem[i].record_status+`</td>
						</tr>
					`;
				}
			}
			$ID('record_list').innerHTML += table_in_hh
			// println(JSON.stringify(LS_IND_HH))
		}catch{println("error in hh_recreate_imput>add_to_ind_list")}
	});
}

function add_to_ind_ltable(val_id, indv_list){
	// LS_IND_HH.push(val_id)
	try{
		var table_in_hh = ''
		for (var i = 0; i < indv_list.length; i++) {
			if(val_id == indv_list[i].record_id){
				// LS_IND_HH.push(val_id)
				table_in_hh += `
					<tr class='ls_ind_tbl' id="`+indv_list[i].record_id+`">
						<td><button onclick="remove_ind(`+indv_list[i].record_id+`)" class="x-btn x-round-large x-orange">Remove <span class="fa fa-trash  "></span></button></td>
						<td>`+indv_list[i].last_name+", "+indv_list[i].first_name+" "+indv_list[i].middle_name+","+indv_list[i].ext_name+`</td>
						<td>`+indv_list[i].sex+`</td>
						<td>`+indv_list[i].birthdate+`</td>
						<td>`+indv_list[i].geo_map_group_id+`</td>
						<td>`+indv_list[i].group_status+`</td>
						<td>`+indv_list[i].record_status+`</td>
					</tr>
				`;
			}
		}
		$ID('record_list').innerHTML += table_in_hh
		// println(JSON.stringify(LS_IND_HH))
	}catch{println("error in hh_recreate_imput>add_to_ind_list")}
}

function remove_ind(ids){
	var ls_index = LS_IND_HH.indexOf(ids.toString())
	println(ids + " : "+ls_index)
	LS_IND_HH = array_remove_by_index(LS_IND_HH,ls_index)
	println("JSON.stringify(LS_IND_HH)")
	println(JSON.stringify(LS_IND_HH))
	$ID(ids).remove()
}


function array_remove_by_index(array,index){;
	if (index > -1) {
		array.splice(index, 1); // 2nd parameter means remove one item only
	}
	return array
}

//record_insert": "{\"id\":{\"7946\":\"7946\",\"8124\":\"8124\",\"8122\":\"8122\"},\"status\":{\"7946\":\"PENDING\",\"8124\":\"PENDING\",\"8122\":\"PENDING\"}}"

function image_upload(img_body){
	var g_id = $ID('geo_map_group_id').value
	println("image_hh")
	$send({
		action : DOMAIN + '/api/upload-image',
		data : $DATA({"hh_id":g_id}).appendFile(img_body),
		func : function (rrr){
			
		}
	})
}

function _autocomplete(inp, arr) {
	var currentFocus;
	inp.addEventListener("input", function(e) {
			var a, b, i, val = this.value;
			closeAllLists();
			if (!val) { return false;}
			currentFocus = -1;
			a = document.createElement("DIV");
			a.setAttribute("id", this.id + "autocomplete-list");
			a.setAttribute("class", "autocomplete-items");
			this.parentNode.appendChild(a);
			for (i = 0; i < arr.length; i++) {
				if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
					b = document.createElement("DIV");
					b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
					b.innerHTML += arr[i].substr(val.length);
					b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
					b.addEventListener("click", function(e) {
							inp.value = this.getElementsByTagName("input")[0].value;
							CHANGE_HH_search_records(inp.value)
							closeAllLists();
					});
					a.appendChild(b);
				}
			}
	});
	
	inp.addEventListener("keydown", function(e) {
			var x = document.getElementById(this.id + "autocomplete-list");
			if (x) x = x.getElementsByTagName("div");
			if (e.keyCode == 40) {
				currentFocus++;
				addActive(x);
			} else if (e.keyCode == 38) { //up
				currentFocus--;
				addActive(x);
			} else if (e.keyCode == 13) {
				e.preventDefault();
				if (currentFocus > -1) {
					if (x) x[currentFocus].click();
				}
			}
	});

	function addActive(x) {
		if (!x) return false;
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = (x.length - 1);
		x[currentFocus].classList.add("autocomplete-active");
	}

	function removeActive(x) {
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}

	function closeAllLists(elmnt) {
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}

	document.addEventListener("click", function (e) {
			closeAllLists(e.target);
	});
}