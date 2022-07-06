
let DATA = undefined
let DATA_TOSYNC = undefined
let data_ = JSON.parse(url_args['data']);
let indv_list = undefined
let indv_list_tobesync = undefined
let SELECTED_IND_ID = undefined
let isNewRecord = false
let res_fields = ""

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	console.log(cordova.file);
	println(" * individual Module Ready ===================");
	get_sync()
}

// get_sync()
function get_sync(){
	get_sync_offline()
	get_indv_list_tobesync_ls()
	// $send({
	// 	action : DOMAIN+"/api/login",
	// 	method : "POST",
	// 	data : JSON.stringify(data_),
	// 	func : function (ress) {
	// 		var resp = JSON.parse(ress);DATA=resp
	// 		if(!resp.success){$ID('modal_login_loading').style.display='none';println(" * Error in Fetching Data");}
	// 		else{$ID('modal_login_loading').style.display='none';println(" * Fetching Data Done");}
	// 		indv_list = DATA.record.individual
	// 		// _createNewFileEntry("user_data_records2.txt",ress)
	// 		res_fields=DATA.fields.individual
	// 		_createNewFileEntry("user_data_records2.txt",ress)
	// 		// println(resp)
	// 		get_indv_list()
	// 		alert("Data Syncronization completed")
	// 		// __getf__()
			
	// 	}
	// })//
}

function get_sync_offline(){
	_readFileEntry("user_data_records2.txt",function (resp){
		var resp = JSON.parse(resp);DATA=resp
		if(!resp.success){$ID('modal_login_loading').style.display='none';println(" * Error in Fetching Data");}
		else{$ID('modal_login_loading').style.display='none';println(" * Fetching Data Done");}
		indv_list = DATA.record.individual
		res_fields=DATA.fields.individual
		get_indv_list() //GET ALL LIST
		// alert("Data Syncronization completed")
	})
}

function get_indv_list_tobesync_ls() {
	_readFileEntry("to_beSync.txt",function (resp_){
		var to_beSync = JSON.parse(resp_);
		DATA_TOSYNC=to_beSync
		indv_list_tobesync = DATA_TOSYNC.data.individual
		get_indv_list_tobesync()
	})
}



// function __getf__(){
// 	$send({
// 		action : DOMAIN+'/api/fields',
// 		method : POST,
// 		data : JSON.stringify({"access":{"user_id":DATA.credential.user_id,"session_id":DATA.credential.session_id},"module":{"name":"individual"}}),
// 		func : function (res){
// 			res_fields=res;
// 			println(" list field initialized")
// 			_createNewFileEntry("req_fields.txt",ress)
// 		}
// 	})
// }


//-----------------------------------------------------------------
function submit_info_ind(){
	var form_field = document.forms[0]
	var submitted = {}

	for (var i = 0; i < form_field.length; i++) {
		println(form_field[i].name+" :: "+form_field[i].value)

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
	submitted['animal_list'] = JSON.stringify(submitted['animal_list'] )
	submitted['benefits'] = JSON.stringify(submitted['benefits'] )
	submitted['job_preference'] = JSON.stringify(submitted['job_preference'] )
	submitted['list_registered_motor'] = JSON.stringify(submitted['list_registered_motor'] )
	submitted['work_experience'] = JSON.stringify(submitted['work_experience'] )
	submitted['edication_background'] = JSON.stringify(submitted['edication_background'] )
	submitted['profile_image'] = JSON.stringify(SEL_IMG )
	SEL_IMG = []

	for (var i = 0; i < FIELD_X_IND.length; i++) {delete submitted[FIELD_X_IND[i]]}

	submitted['record_id'] = SELECTED_IND_ID
	
	if(isNewRecord){submitted["added_date"] = new Date().toISOString().slice(0, 19).replace('T', ' ')}
	submitted['latest_edit_date'] = new Date().toISOString().slice(0, 19).replace('T', ' ')

	// __DATA_TO_SYNC.data.individual.push(submitted)
	_readFileEntry("to_beSync.txt",function (res){
		var old_inp = JSON.parse(res)
		var isalreadyadded = false
		var entry_status = ""
		var index_same = 0
		for (var i = 0; i < old_inp.data.individual.length; i++) {
			if(old_inp.data.individual[i].record_id==submitted.record_id){
				isalreadyadded = true
				index_same = i
				break
			}
		}


		if(isalreadyadded){
			entry_status = "Editted";
			old_inp.data.individual[index_same]=submitted
		}else{
			entry_status = "Added";
			old_inp.data.individual.push(submitted)
		}

		var answer = window.confirm("The Entry is now "+entry_status+"\nContinue ?");
		if (answer) {
			println(old_inp.length+ " == Entry for updated list")
			__createNewFileEntry("to_beSync.txt",JSON.stringify(old_inp),function(){
				alert("Data : "+ SELECTED_IND_ID + " is added for synchronization")
				$ID('_sample_modal_ind_info').style.display='none'
				no_edit()
				goto("home_screen.html?data="+url_args['data'])
			})
		}
		else {
			alert("Data : "+ SELECTED_IND_ID + " is NOT BE ADDED for synchronization")
			$ID('_sample_modal_ind_info').style.display='none'
			no_edit()
		}


		
	})

}

function get_fields_ind(__index){ //FUNCTION : Getting info of Selected Individual on the List
	println("NEW GET FIRLD = " + __index)
	$ID("img_cont").innerHTML = ""
	if(indv_list[__index]==undefined){
		selected_ind = gen_code(4)
		SELECTED_IND_ID = gen_code(5)
		isNewRecord = true
	}
	else{
		var selected_ind = indv_list[__index]
		SELECTED_IND_ID = selected_ind.record_id
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
		if(flist[i].name!="profile_info"){
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

			if(Tt == "html" || Tt =="json" || flist[i].property.type == "html"){
				// continue
				ffields_1 += `` + flist[i].option
			}

			if(Tt == "label"){
				var disp_ = "none"
				var class_ = "FIELDS"
				if(flist[i].label.indexOf("checkbox")==-1){disp_="block";class_=""}
				ffields_1 += `</div><hr><b class="" onmouseup="show_drop_fields_ind(`+i+`)">`+flist[i].label+`</b><br><div id="FIELDS_`+i+`" class="`+class_+` x-leftbar x-padding" style="display:`+disp_+`;">`
			}
			ffields_1 +='<br>'
		} // SKIPPED FIILED


	}
	element.innerHTML = ffields_1
	add_class2class("table",'x-table','x-border');
	add_class2class("table-responsive",'x-responsive');
	add_class2class("img-responsive","x-img","x-image","x-center")
	add_class2class("firstfld","x-input","x-border")
	add_class2class("add-row","x-btn","x-round-large","x-blue")
	$ID('_sample_modal_ind_info').style.display='block' // IND for Data
	const inputs = document.querySelectorAll('.ins_f_');
	inputs.forEach(input => input.disabled = true);
	popu_add_row()
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
						<span class="x-tiny">
							<span class="x-text-grey">Name<br></span><span>`+indv_list[i].first_name+" "+indv_list[i].middle_name+" "+indv_list[i].last_name+" "+indv_list[i].ext_name+`</span>
						</span><br>
						<span class="x-tiny">
							<span class="x-text-grey">Birthday<br></span><span>`+indv_list[i].birthdate+`</span>
						</span>
					</div>
					<div class="x-container x-col s6">
						<span class="x-tiny">
							<span class="x-text-grey">Status<br></span><span >`+indv_list[i].group_status+`</span>
						</span><br>
						<span class="x-tiny">
							<span class="x-text-grey">Contact Number <br></span>`+indv_list[i].contact_no+`<span></span>
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
					<span class="x-tiny">
						<span class="x-text-grey">Name<br></span><span>`+indv_list[i].first_name+" "+indv_list[i].middle_name+" "+indv_list[i].last_name+" "+indv_list[i].ext_name+`</span>
					</span><br>
					<span class="x-tiny">
						<span class="x-text-grey">Birthday<br></span><span>`+indv_list[i].birthdate+`</span>
					</span>
				</div>
				<div class="x-container x-col s6">
					<span class="x-tiny">
						<span class="x-text-grey">Status<br></span><span >`+indv_list[i].group_status+`</span>
					</span><br>
					<span class="x-tiny">
						<span class="x-text-grey">Contact Number <br></span>`+indv_list[i].contact_no+`<span></span>
					</span>
				</div>
			</div>`
	}
	$ID('indv_list').innerHTML = ls_inv_init
}
function get_indv_list_tobesync(){
	var ls_inv_init_tosync = ""
	for (var i = 0; i < indv_list_tobesync.length; i++) {
		ls_inv_init_tosync += `
			<div class="x-container x-padding x-card x-round-large x-pale-blue" onclick="">
				<div class=" x-col s5">
					<span class="x-tiny">
						<span class="x-text-grey">Name<br></span><span>`+indv_list_tobesync[i].first_name+" "+indv_list_tobesync[i].middle_name+" "+indv_list_tobesync[i].last_name+" "+indv_list_tobesync[i].ext_name+`</span>
					</span><br>
					<span class="x-tiny">
						<span class="x-text-grey">Birthday<br></span><span>`+indv_list_tobesync[i].birthdate+`</span>
					</span>
				</div>
				<div class="x-container x-col s4">
					<span class="x-tiny">
						<span class="x-text-grey">Status<br></span><span >`+indv_list_tobesync[i].group_status+`</span>
					</span><br>
					<span class="x-tiny">
						<span class="x-text-grey">Contact Number <br></span>`+indv_list_tobesync[i].contact_no+`<span></span>
					</span>
				</div>
				<div class="x-container x-col s3">
					<button class="x-btn x-block x-round-large x-green" onclick="get_ind_data_tobesync(`+i+`)">
						<span class="fa fa-edit"></span>
					</button><br>
					<button class="x-btn x-block x-round-large x-red" onclick="delete_sync('`+indv_list_tobesync[i].record_id+`')">
						<span class="fa fa-trash"></span>
					</button>
				</div>
			</div>`
	}
	$ID('indv_list_tobesync').innerHTML = ls_inv_init_tosync
}


function delete_sync(ids) {
	_readFileEntry("to_beSync.txt",function (resp_){
		var to_beSync = JSON.parse(resp_);
		indv_list_tobesync = to_beSync.data.individual
		var new_dat = []
		var answer = window.confirm("Proceed Deleting  ["+ids+"] ?");
		if(answer){
			for (var i = 0; i < indv_list_tobesync.length; i++) {
				if(indv_list_tobesync[i].record_id!=ids){
					new_dat.push(indv_list_tobesync[i])
				}
			}
		}
		to_beSync.data.individual = new_dat
		__createNewFileEntry("to_beSync.txt",JSON.stringify(to_beSync),function(){
			// alert("Entry ["+ids+"] Deleted")
			goto("home_screen.html?data="+url_args['data'])
		})

	})
}

function get_ind_data(index_){
	get_fields_ind(index_) 
	var selected_ind = indv_list[index_]
}

function get_ind_data_tobesync(index_){
	get_fields_ind_tobesync(index_) 
	var selected_ind_tobesync = indv_list_tobesync[index_]
}

function gotto_ind(){
	// alert(window.location.href)
	goto("hh_home_screen.html?data="+url_args['data'])
	// goto("hh_home_screen.html?data="+url_args['data'])
}


// --------------------

function get_fields_ind_tobesync(__index){ //FUNCTION : Getting info of Selected Individual on the List
	if(indv_list_tobesync[__index]==undefined){
		selected_ind = gen_code(4)
		SELECTED_IND_ID = gen_code(5)
		isNewRecord = true
	}
	else{
		var selected_ind = indv_list_tobesync[__index]
		SELECTED_IND_ID = selected_ind.record_id
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
		if(flist[i].name!="profile_info"){
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

			if(Tt == "html" || Tt =="json" || flist[i].property.type == "html"){
				// continue
				ffields_1 += `` + flist[i].option
			}

			if(Tt == "label"){
				var disp_ = "none"
				var class_ = "FIELDS"
				if(flist[i].label.indexOf("checkbox")==-1){disp_="block";class_=""}
				ffields_1 += `</div><hr><b class="" onmouseup="show_drop_fields_ind(`+i+`)">`+flist[i].label+`</b><br><div id="FIELDS_`+i+`" class="`+class_+` x-leftbar x-padding" style="display:`+disp_+`;">`
			}
			ffields_1 +='<br>'
		} // SKIPPED FIILED

	}
	element.innerHTML = ffields_1
	add_class2class("table",'x-table','x-border');
	add_class2class("table-responsive",'x-responsive');
	add_class2class("img-responsive","x-img","x-image","x-center")
	add_class2class("firstfld","x-input","x-border")
	add_class2class("add-row","x-btn","x-round-large","x-blue")
	$ID('_sample_modal_ind_info').style.display='block' // IND for Data
	const inputs = document.querySelectorAll('.ins_f__tobesync');
	inputs.forEach(input => input.disabled = true);
	popu_add_row()
}



function popu_add_row(){
	var add_btn = $CLASS("add-row")
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