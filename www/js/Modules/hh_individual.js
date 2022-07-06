
let DATA_TOSYNC = undefined
let DATA = undefined
let data_ = JSON.parse(url_args['data']);
let indv_list = undefined
let indv_list_tobesync = undefined
let SELECTED_IND_ID = undefined
let isNewRecord = false
let res_fields = ""
var LS_IND_HH = []


document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	console.log(cordova.file);
	println(" * household Module Ready ===================");
	get_sync()
}

get_sync()
function get_sync(){
	get_sync_offline()
	get_indv_list_tobesync_ls()
}

function get_sync_offline(){
	_readFileEntry("user_data_records2.txt",function (resp){
		var resp = JSON.parse(resp);DATA=resp
		if(!resp.success){$ID('modal_login_loading').style.display='none';println(" * Error in Fetching Data");}
		else{$ID('modal_login_loading').style.display='none';println(" * Fetching Data Done");}
		indv_list = DATA.record.household
		res_fields=DATA.fields.household
		get_indv_list()
		// alert("Data Syncronization completed")
	})
}

function get_indv_list_tobesync_ls() {
	_readFileEntry("to_beSync.txt",function (resp_){
		var to_beSync = JSON.parse(resp_);
		DATA_TOSYNC=to_beSync
		indv_list_tobesync = DATA_TOSYNC.data.household
		get_indv_list_tobesync()
	})
}


//go_edit
//-----------------------------------------------------------------
function submit_info_ind(){
	var form_field = document.forms[0]
	var submitted = {}
	for (var i = 0; i < form_field.length; i++) {
		if(form_field[i].name.indexOf("[") ==-1 || form_field[i].name.indexOf("]") ==-1 ){
			submitted[form_field[i].name ] = form_field[i].value
		}
		else{
			var main_key = form_field[i].name.split("[")[0]
			var sub_key = form_field[i].name.split("[")[1].replace("[","").replace("]","")
			if(!submitted[main_key]){submitted[main_key] = {} }
			if(!submitted[main_key][sub_key]){submitted[main_key][sub_key] = []}
			submitted[main_key][sub_key].push(form_field[i].value)
		}
	}

	submitted['pet'] = JSON.stringify(submitted['pet'] )
	submitted['deceased_member'] = JSON.stringify(submitted['deceased_member'] )
	submitted['job_preference'] = JSON.stringify(submitted['job_preference'] )
	submitted['record_insert'] = JSON.stringify({"id":LS_IND_HH})
	LS_IND_HH = []
	
	submitted['documents'] = JSON.stringify(__SEL_IMG )
	SEL_IMG = []

	for (var i = 0; i < FIELD_X_HH.length; i++) {delete submitted[FIELD_X_HH[i]]}

	submitted['group_id'] = SELECTED_IND_ID
	
	if(isNewRecord){submitted["added_date"] = new Date().toISOString().slice(0, 19).replace('T', ' ')}
	submitted['latest_edit_date'] = new Date().toISOString().slice(0, 19).replace('T', ' ')

	// __DATA_TO_SYNC.data.household.push(submitted)
	_readFileEntry("to_beSync.txt",function (res){
		var old_inp = JSON.parse(res)
		var isalreadyadded = false
		var entry_status = ""
		var index_same = 0

		for (var i = 0; i < old_inp.data.household.length; i++) {
			if(old_inp.data.household[i].group_id==submitted.group_id){
				isalreadyadded = true
				index_same = i
				break
			}
		}


		if(isalreadyadded){
			entry_status = "Editted"
			old_inp.data.household[index_same]=submitted
		}else{
			entry_status = "Added"
			old_inp.data.household.push(submitted)
		}

		println(old_inp.length+ " == Entry for updated list")
		var answer = window.confirm("The Entry is now "+entry_status+"\nContinue ?");
		if (answer) {
			__createNewFileEntry("to_beSync.txt",JSON.stringify(old_inp),function(){

				alert("Data : ID["+ SELECTED_IND_ID + "] is added for syncronization")
				$ID('_sample_modal_ind_info').style.display='none'
				no_edit()
				LS_IND_HH = []
				get_indv_list_tobesync_ls()
			})
		}
		else{
			alert("Data : ID["+ SELECTED_IND_ID + "] is NOT BE ADDED for synchronization")
			$ID('_sample_modal_ind_info').style.display='none'
			no_edit()
		}
		
	})    ///////////////////////// CORDOVA PLUGIN ///////////////////

}

function get_fields_ind(__index){ //FUNCTION : Getting info of Selected household on the List
	LS_IND_HH = []
	$ID("img_cont").innerHTML = ""
	if(indv_list[__index]==undefined){
		selected_ind = gen_code(4)
		SELECTED_IND_ID = gen_code(5)
		isNewRecord = true
	}
	else{
		var selected_ind = indv_list[__index]
		isNewRecord = false
		SELECTED_IND_ID = selected_ind.group_id
		$ID('edit_buttons').style.display = "block"
	}



	var ffields_1 = ""
	var arr_list = []
	flist = res_fields
	// flist = (JSON.parse(res_fields).fields)
	// println(flist)
	var element = $ID("ind_fields1");
	types_ = {}
	for (var i = 0; i < flist.length; i++) {
		var Tt =  flist[i].property.type
		types_[Tt] = Tt;
		if(selected_ind[flist[i].name]==undefined || selected_ind[flist[i].name]=="undefined"){selected_ind[flist[i].name]=""}
		if(flist[i].property.sub_type != null){Tt = flist[i].property.sub_type}
		if(Tt == "text" || Tt == "date" || Tt == "number"){
			ffields_1 += `
			<span class="x-text-grey">`+flist[i].label+`</span>
			<input value="`+selected_ind[flist[i].name]+`" type='`+Tt+`'  name="`+flist[i].name+`"id='`+flist[i].name+`' class='ins_f_ x-input x-border x-round-large' placeholder='`+flist[i].label+`'  />`
		}
		if(Tt == "select"){
			var _opt = ''
			var _keys = Object.keys(flist[i].option)
			for (var ii = 0; ii < _keys.length; ii++) {
				_opt += `<option value='`+_keys[ii]+`'>`+_keys[ii]+`</option>`
				
			}
			ffields_1 += `
			<span class="x-text-grey">`+flist[i].label+`</span>
			<select value="`+selected_ind[flist[i].name]+`" class='ins_f_ x-select x-border x-round-large' name="`+flist[i].name+`" id=`+flist[i].name+`>`+_opt+`</select>`
		}
		if(Tt == "radio"){
			var _opt = ''
			var _keys = flist[i].option
			for (var ii = 0; ii < _keys.length; ii++) {
				_opt += `<option class="ins_f_" value='`+_keys[ii]+`'>`+_keys[ii]+`</option>`
			}
			ffields_1 += `
			<span class="x-text-grey">`+flist[i].label+`</span>
			<select value="`+selected_ind[flist[i].name]+`" class='ins_f_ x-select x-border x-round-large' name="`+flist[i].name+`" id=`+flist[i].name+`>`+_opt+`</select>`
		}

		if(Tt == "html" || Tt =="json" || flist[i].property.type == "html" || flist[i].property.type == "json"){
			// continue
			ffields_1 += `<hr><b>` + flist[i].label+`</b><br>` + flist[i].option
		}

		if(Tt == "label"){
			var disp_ = "none"
			var class_ = "FIELDS"
			if(flist[i].label.indexOf("checkbox")==-1){disp_="block";class_=""}
			ffields_1 += `</div><hr><b class="" onmouseup="show_drop_fields_ind(`+i+`)">`+flist[i].label+`</b><br><div id="FIELDS_`+i+`" class="`+class_+` x-leftbar x-padding" style="display:`+disp_+`;">`
		}
		ffields_1 +='<br>'

	}

	element.innerHTML = ffields_1 + "<input hidden  name='geo_map_group_id' value='"+selected_ind['geo_map_group_id']+"'>"
	add_class2class("table",'x-table','x-border');
	add_class2class("table-responsive",'x-responsive');
	add_class2class("img-responsive","x-img","x-image","x-center")
	add_class2class("firstfld","x-input","x-border")
	add_class2class("add-row","x-btn","x-round-large","x-blue")


	$ID('longitude').classList.add("x-input","x-block","x-border")
	$ID('latitude').classList.add("x-input","x-block","x-border")
	$ID('longitude').value = selected_ind.longitude
	$ID('latitude').value = selected_ind.latitude
	$ID('longitude').placeholder = "longitude"
	$ID('latitude').placeholder = "latitude"
	// $ID('current_log').style.display = "none"
	// $ID('current_lat').style.display = "none"
	if(selected_ind.longitude!="" || selected_ind.longitude!=undefined || selected_ind.longitude!=null){
		$ID('current_log').innerHTML = selected_ind.longitude
		$ID('current_lat').innerHTML = selected_ind.latitude
	}else{
		$ID('current_log').innerHTML = "<span class=''>No Coordinates yet</span>"
		$ID('current_lat').innerHTML = "<span class=''>No Coordinates yet</span>"
	}


	$ID('_sample_modal_ind_info').style.display='block' // IND for Data
	const inputs = document.querySelectorAll('.ins_f_');
	inputs.forEach(input => input.disabled = true);
	re_create_inputs()
	popu_add_row()

	var memb_ = JSON.parse(JSON.stringify(selected_ind.record_insert))
	var jMem = JSON.parse(memb_).id
	for(var key in jMem) {
		println("Member in Household = "+key)
		add_to_ind_list(key,DATA.record.individual)
	}


}

let temp_f_sel = 0
function show_drop_fields_ind(ind){
	var c_f = $CLASS("FIELDS")
	var sel_f = $ID("FIELDS_"+ind)
	// println(sel_f)
	for (var i = 0; i < c_f.length; i++) {c_f[i].style.display = "none"}
	if(temp_f_sel==ind){
		sel_f.style.display = "none"
	}
	else{
		sel_f.style.display = "block"
		temp_f_sel = ind
	}
}

function ind_search_field(search_item){
	var search_arr  = search_item.split(" ")
	var ls_inv_init = ""
	$ID('modal_login_loading').style.display='block'
	var res_counter = 0
	for (var i = 0; i < indv_list.length; i++) {
		if(search_str_arr(JSON.stringify(indv_list[i]),search_arr)){
			ls_inv_init += `
				<div class="x-container x-card x-round-large x-white" onclick="get_ind_data(`+i+`)">
					<div class=" x-col s6">
						<span>
							<b>
								`+indv_list[i].last_name+`, 
								`+indv_list[i].middle_name+`
								`+indv_list[i].first_name+`
								<br>
							</b>
						</span>
						<span class="x-tiny">
							<span class="x-text-grey">
								Address<br>
							</span>
							<span>
								`+indv_list[i].brgy+`/<br>
								`+indv_list[i].municipality+`
								`+indv_list[i].province+`<br>
								<i class='x-text-grey x-tiny'>`+indv_list[i].geo_map_group_id+`</i>
							</span>
						</span>
					</div>
					<div class="x-container x-col s6">
						<span class="x-tiny">
							<span class="x-text-grey">Status<br></span><span >`+indv_list[i].hh_status+`</span>
						</span><br>
						<span class="x-tiny">
							<span class="x-text-grey">Coordinates(long/lat) <br></span>`+indv_list[i].longitude+` : `+indv_list[i].latitude+`<span></span>
						</span>
					</div>
				</div>`
			res_counter += 1
		}
	}
	$ID('search_note').innerHTML = "<span>Showing <b>"+res_counter+"</b> Results</span>"
	$ID('indv_list').innerHTML = ls_inv_init
	$ID('modal_login_loading').style.display='none'

}

function get_indv_list(){
	var ls_inv_init = ""
	for (var i = 0; i < indv_list.length; i++) {
		ls_inv_init += `
				<div class="x-container x-card x-round-large x-white" onclick="get_ind_data(`+i+`)">
					<div class=" x-col s6">
						<span>
							<b>
								`+indv_list[i].last_name+`, 
								`+indv_list[i].middle_name+`
								`+indv_list[i].first_name+`
								<br>
							</b>
						</span>
						<span class="x-tiny">
							<span class="x-text-grey">
								Address<br>
							</span>
							<span>
								`+indv_list[i].brgy+`/<br>
								`+indv_list[i].municipality+`
								`+indv_list[i].province+`<br>
								<i class='x-text-grey x-tiny'>`+indv_list[i].geo_map_group_id+`</i>
							</span>
						</span>
					</div>
					<div class="x-container x-col s6">
						<span class="x-tiny">
							<span class="x-text-grey">Status<br></span><span >`+indv_list[i].hh_status+`</span>
						</span><br>
						<span class="x-tiny">
							<span class="x-text-grey">Coordinates(long/lat) <br></span>`+indv_list[i].longitude +` : `+ indv_list[i].latitude+`<span></span>
						</span>
					</div>
				</div>`
	}
	$ID('indv_list').innerHTML = ls_inv_init
}

function get_indv_list_tobesync(){
	var ls_inv_init_tobesync = ""
	for (var i = 0; i < indv_list_tobesync.length; i++) {
		ls_inv_init_tobesync += `
				<div class="x-container x-card x-padding x-round-large x-pale-green x-white" >
					<div class=" x-col s5">
						<span class="x-tiny">
							<span class="x-text-grey">Barcode/Geomap ID<br></span><span>`+indv_list_tobesync[i].barcode+`/<br>`+indv_list_tobesync[i].geo_map_group_id+`</span>
						</span>
					</div>
					<div class="x-container x-col s4">
						<span class="x-tiny">
							<span class="x-text-grey">Status<br></span><span >`+indv_list_tobesync[i].hh_status+`</span>
						</span><br>
						<span class="x-tiny">
							<span class="x-text-grey">Coordinates(long/lat) <br></span>`+indv_list_tobesync[i].longitude +` : `+ indv_list_tobesync[i].latitude+`<span></span>
						</span>
					</div>
					<div class="x-container x-col s3">
						<button class="x-btn x-block x-round-large x-green" onclick="get_ind_data_tobesync(`+i+`)">
							<span class="fa fa-edit"></span>
						</button><br>
						<button class="x-btn x-block x-round-large x-red" onclick="delete_sync('`+indv_list_tobesync[i].geo_map_group_id+`')">
							<span class="fa fa-trash"></span>
						</button>
					</div>
				</div>`
	}
	$ID('indv_list_tobesync').innerHTML = ls_inv_init_tobesync
}


function delete_sync(ids) {
	_readFileEntry("to_beSync.txt",function (resp_){
		var to_beSync = JSON.parse(resp_);
		indv_list_tobesync = to_beSync.data.household
		var new_dat = []
		var answer = window.confirm("Proceed Deleting  ["+ids+"] ?");
		if(answer){
			for (var i = 0; i < indv_list_tobesync.length; i++) {
				if(indv_list_tobesync[i].geo_map_group_id!=ids){
					new_dat.push(indv_list_tobesync[i])
				}
			}
		}
		to_beSync.data.household = new_dat
		__createNewFileEntry("to_beSync.txt",JSON.stringify(to_beSync),function(){
			// alert("Entry ["+ids+"] Deleted")
			goto("hh_home_screen.html?data="+url_args['data'])
		})

	})
}
function get_ind_data(index_){
	println("You Selected Item : "+index_)
	get_fields_ind(index_) 
	var selected_ind = indv_list[index_]
}

function get_ind_data_tobesync(index_){
	get_fields_ind_tobesync(index_) 
	var selected_ind_tobesync = indv_list_tobesync[index_]
}

function gotto_ind(){
	goto("home_screen.html?data="+JSON.stringify(data_))
}



function get_fields_ind_tobesync(__index){ //FUNCTION : Getting info of Selected household on the List
	LS_IND_HH = []
	$ID("img_cont").innerHTML = ""
	if(indv_list_tobesync[__index]==undefined){
		selected_ind = gen_code(4)
		SELECTED_IND_ID = gen_code(5)
		isNewRecord = true
	}
	else{
		var selected_ind = indv_list_tobesync[__index]
		SELECTED_IND_ID = selected_ind.group_id
		$ID('edit_buttons').style.display = "block"
	}



	var ffields_1 = ""
	var arr_list = []
	flist = res_fields
	// flist = (JSON.parse(res_fields).fields)
	// println(flist)
	var element = $ID("ind_fields1");
	types_ = {}
	for (var i = 0; i < flist.length; i++) {
		var Tt =  flist[i].property.type
		types_[Tt] = Tt;
		if(flist[i].property.sub_type != null){Tt = flist[i].property.sub_type}
		if(Tt == "text" || Tt == "date" || Tt == "number"){
			ffields_1 += `
			<span class="x-text-grey">`+flist[i].label+`</span>
			<input value="`+selected_ind[flist[i].name]+`" type='`+Tt+`'  name="`+flist[i].name+`"id='`+flist[i].name+`' class='ins_f_ x-input x-border x-round-large' placeholder='`+flist[i].label+`'  />`
		}
		if(Tt == "select"){
			var _opt = ''
			var _keys = Object.keys(flist[i].option)
			for (var ii = 0; ii < _keys.length; ii++) {
				_opt += `<option value='`+_keys[ii]+`'>`+_keys[ii]+`</option>`
				
			}
			ffields_1 += `
			<span class="x-text-grey">`+flist[i].label+`</span>
			<select value="`+selected_ind[flist[i].name]+`" class='ins_f_ x-select x-border x-round-large' name="`+flist[i].name+`" id=`+flist[i].name+`>`+_opt+`</select>`
		}
		if(Tt == "radio"){
			var _opt = ''
			var _keys = flist[i].option
			for (var ii = 0; ii < _keys.length; ii++) {
				_opt += `<option class="ins_f_" value='`+_keys[ii]+`'>`+_keys[ii]+`</option>`
			}
			ffields_1 += `
			<span class="x-text-grey">`+flist[i].label+`</span>
			<select value="`+selected_ind[flist[i].name]+`" class='ins_f_ x-select x-border x-round-large' name="`+flist[i].name+`" id=`+flist[i].name+`>`+_opt+`</select>`
		}

		if(Tt == "html" || Tt =="json" || flist[i].property.type == "html" || flist[i].property.type == "json"){
			// continue
			ffields_1 += `<hr><b>` + flist[i].label+`</b><br>` + flist[i].option
		}

		if(Tt == "label"){
			var disp_ = "none"
			var class_ = "FIELDS"
			if(flist[i].label.indexOf("checkbox")==-1){disp_="block";class_=""}
			ffields_1 += `</div><hr><b class="" onmouseup="show_drop_fields_ind(`+i+`)">`+flist[i].label+`</b><br><div id="FIELDS_`+i+`" class="`+class_+` x-leftbar x-padding" style="display:`+disp_+`;">`
		}
		ffields_1 +='<br>'

	}

	element.innerHTML = ffields_1 + "<input hidden  name='geo_map_group_id' value='"+selected_ind['geo_map_group_id']+"'>"
	add_class2class("table",'x-table','x-border');
	add_class2class("table-responsive",'x-responsive');
	add_class2class("img-responsive","x-img","x-image","x-center")
	add_class2class("firstfld","x-input","x-border")
	add_class2class("add-row","x-btn","x-round-large","x-blue")

	$ID('longitude').classList.add("x-input","x-block","x-border")
	$ID('latitude').classList.add("x-input","x-block","x-border")
	$ID('longitude').value = selected_ind.longitude
	$ID('latitude').value = selected_ind.latitude
	$ID('longitude').placeholder = "longitude"
	$ID('latitude').placeholder = "latitude"

	if(selected_ind.longitude!="" || selected_ind.longitude!=undefined || selected_ind.longitude!=null){
		$ID('current_log').innerHTML = selected_ind.longitude
		$ID('current_lat').innerHTML = selected_ind.latitude
	}else{
		$ID('current_log').innerHTML = "<span class=''>No Coordinates yet</span>"
		$ID('current_lat').innerHTML = "<span class=''>No Coordinates yet</span>"
	}




	$ID('_sample_modal_ind_info').style.display='block' // IND for Data
	const inputs = document.querySelectorAll('.ins_f_');
	inputs.forEach(input => input.disabled = true);
	re_create_inputs()
	popu_add_row()

	var memb_ = JSON.parse(JSON.stringify(selected_ind.record_insert))
	// println(selected_ind.record_insert)
	var jMem = JSON.parse(memb_).id
	for (var i = 0; i < jMem.length; i++){
		println("Member in Household = "+jMem[i])
		add_to_ind_list(jMem[i],DATA.record.individual)
	}

	println(" IMGS =========")
	var simg = JSON.parse(selected_ind.documents)
	// println(selected_ind.documents)
	// println(typeof(selected_ind.documents))
	println(simg[0])
	println(typeof(simg[0]))
	// println(" IMGS =========")
	for (var i = 0; i < simg.length; i++) {
		println(simg[i].document_image)
		$ID("img_cont").innerHTML += "<span>"+simg[i].document_image+"</span><br>"
	}

}

function popu_add_row(){
	var add_btn = $CLASS("btn-default")
	println("getting add buttons -==-=-=-=-=-=-=-=--=-=-=")
	for (var i = 0; i < add_btn.length; i++) {
		add_btn[i].id="btn_"+i
		var ___ID_NAME = "div"+i+"div_0"
		add_btn[i].parentNode.parentNode.id = ___ID_NAME
		println(add_btn[i].parentNode.parentNode.id)
		add_btn[i].addEventListener("click", function() {
			duplicate(this.parentNode.parentNode.id)
		})
	}
}

function duplicate(id_name_) {
	var id_name = id_name_.split("_")[0]
	var iii = parseInt(id_name_.split("_")[1])
	var original = $ID(id_name+"_" + iii);
	var clone = original.cloneNode(true); // "deep" clone
	clone.id = id_name + ++ iii; // there can only be one element with an ID
	var clonebtn = clone.querySelectorAll("button")
	for (var i = 0; i < clonebtn.length; i++) {
		clonebtn[i].innerText = "Remove"
		clonebtn[i].classList.add("x-btn","x-block","x-red")
		clonebtn[i].removeEventListener("click", function() {})
		clonebtn[i].addEventListener("click", function() {
			this.parentNode.parentNode.remove()
		})

	}
	// clone.onclick = duplicate; // event handlers are not cloned
	original.parentNode.appendChild(clone);
}